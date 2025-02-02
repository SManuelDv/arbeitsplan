import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const ROOT_DIR = process.cwd()
const BACKUP_DIR = path.join(ROOT_DIR, '.project-guard')
const BACKUP_TAG_PREFIX = 'guard/'
const LOCK_FILE = path.join(BACKUP_DIR, '.backup.lock')
const LOCK_TIMEOUT = 5 * 60 * 1000 // 5 minutos

interface BackupMetadata {
  timestamp: string
  hash: string
  files: string[]
}

// Função para verificar se já existe um backup em andamento
function isBackupInProgress(): boolean {
  if (!fs.existsSync(LOCK_FILE)) {
    return false
  }

  // Verificar se o lock está expirado
  const lockTime = new Date(fs.readFileSync(LOCK_FILE, 'utf-8')).getTime()
  const now = Date.now()

  if (now - lockTime > LOCK_TIMEOUT) {
    console.log(chalk.yellow('⚠️ Lock expirado. Removendo...'))
    removeLock()
    return false
  }

  return true
}

// Função para criar arquivo de lock
function createLock() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }
  fs.writeFileSync(LOCK_FILE, new Date().toISOString())
}

// Função para remover arquivo de lock
function removeLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE)
    }
  } catch (error) {
    console.error(chalk.red('Erro ao remover arquivo de lock:'), error)
  }
}

// Limpar locks órfãos na inicialização
if (isBackupInProgress()) {
  console.log(chalk.yellow('⚠️ Encontrado lock de backup anterior. Verificando...'))
  if (Date.now() - new Date(fs.readFileSync(LOCK_FILE, 'utf-8')).getTime() > LOCK_TIMEOUT) {
    console.log(chalk.yellow('⚠️ Lock expirado. Removendo...'))
    removeLock()
  }
}

function executeGit(command: string, silent: boolean = false): string {
  try {
    return execSync(command, { 
      stdio: silent ? 'pipe' : 'inherit',
      encoding: 'utf-8'
    })
  } catch (error) {
    if (!silent) {
      console.error(chalk.red(`Erro ao executar comando git: ${command}`))
      if (error instanceof Error) {
        console.error(chalk.red(error.message))
      }
    }
    return ''
  }
}

function checkGitStatus(): boolean {
  // Verificar se estamos em um repositório git
  try {
    executeGit('git rev-parse --is-inside-work-tree', true)
  } catch {
    console.error(chalk.red('❌ Este diretório não é um repositório Git'))
    return false
  }

  // Verificar se há conflitos
  const status = executeGit('git status --porcelain', true)
  const hasConflicts = status.split('\n').some(line => line.startsWith('UU'))
  
  if (hasConflicts) {
    console.error(chalk.red('❌ Existem conflitos Git que precisam ser resolvidos'))
    return false
  }

  return true
}

function backup() {
  // Verifica se já existe um backup em andamento
  if (isBackupInProgress()) {
    console.log(chalk.yellow('⚠️ Já existe um backup em andamento. Aguarde...'))
    return
  }

  try {
    createLock()
    console.log(chalk.blue('📦 Criando backup dos arquivos críticos...'))
    
    if (!checkGitStatus()) {
      process.exit(1)
    }

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR)
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFiles: string[] = []

    // Backup dos arquivos críticos
    const CRITICAL_FILES = [
      'package.json',
      'package-lock.json',
      'vite.config.ts',
      'tailwind.config.js',
      'tsconfig.json',
      '.env'
    ]

    CRITICAL_FILES.forEach(file => {
      const filePath = path.join(ROOT_DIR, file)
      if (fs.existsSync(filePath)) {
        const backupPath = path.join(BACKUP_DIR, file)
        fs.copyFileSync(filePath, backupPath)
        backupFiles.push(file)
        console.log(chalk.green(`✓ Backup criado: ${file}`))
      }
    })

    // Criar tag Git
    const tagName = `${BACKUP_TAG_PREFIX}${timestamp}`
    
    // Verificar se há mudanças para commitar
    const status = executeGit('git status --porcelain', true)
    if (status) {
      executeGit('git add .')
      executeGit(`git commit -m "guard: Backup automático [${timestamp}]"`)
    }
    
    // Criar tag mesmo se não houver mudanças
    executeGit(`git tag -a "${tagName}" -m "Backup automático via project-guard"`)
    
    // Tentar push para remoto
    try {
      executeGit('git push origin HEAD --follow-tags')
      console.log(chalk.green('✓ Backup enviado para o repositório remoto'))
    } catch {
      console.log(chalk.yellow('⚠️ Backup criado apenas localmente'))
    }

    // Salvar metadados do backup
    const metadata: BackupMetadata = {
      timestamp,
      hash: executeGit('git rev-parse HEAD', true).trim(),
      files: backupFiles
    }

    fs.writeFileSync(
      path.join(BACKUP_DIR, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    )

    console.log(chalk.green('\n✅ Backup concluído com sucesso!'))
  } finally {
    removeLock()
  }
}

function restore() {
  if (isBackupInProgress()) {
    console.log(chalk.yellow('⚠️ Há um backup em andamento. Aguarde...'))
    return
  }

  try {
    createLock()
    console.log(chalk.blue('🔄 Restaurando arquivos críticos...'))

    if (!checkGitStatus()) {
      process.exit(1)
    }
    
    if (!fs.existsSync(BACKUP_DIR)) {
      console.error(chalk.red('❌ Nenhum backup encontrado!'))
      process.exit(1)
    }

    // Ler metadados do último backup
    const metadataPath = path.join(BACKUP_DIR, 'metadata.json')
    if (!fs.existsSync(metadataPath)) {
      console.error(chalk.red('❌ Metadados do backup não encontrados!'))
      process.exit(1)
    }

    const metadata: BackupMetadata = JSON.parse(
      fs.readFileSync(metadataPath, 'utf-8')
    )

    // Restaurar arquivos
    metadata.files.forEach(file => {
      const backupPath = path.join(BACKUP_DIR, file)
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, path.join(ROOT_DIR, file))
        console.log(chalk.green(`✓ Restaurado: ${file}`))
      }
    })

    // Verificar se precisamos reinstalar dependências
    if (metadata.files.includes('package.json') || metadata.files.includes('package-lock.json')) {
      console.log(chalk.blue('\nReinstalando dependências...'))
      execSync('npm install', { stdio: 'inherit' })
    }

    console.log(chalk.green('\n✅ Restauração concluída com sucesso!'))
  } finally {
    removeLock()
  }
}

function check() {
  if (isBackupInProgress()) {
    console.log(chalk.yellow('⚠️ Há um backup em andamento. Aguarde...'))
    return
  }

  console.log(chalk.blue('🔍 Verificando integridade do projeto...'))

  if (!checkGitStatus()) {
    process.exit(1)
  }
  
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log(chalk.yellow('⚠️ Nenhum backup encontrado. Criando backup inicial...'))
    backup()
    return
  }

  const metadataPath = path.join(BACKUP_DIR, 'metadata.json')
  if (!fs.existsSync(metadataPath)) {
    console.log(chalk.yellow('⚠️ Metadados do backup não encontrados. Criando novo backup...'))
    backup()
    return
  }

  const metadata: BackupMetadata = JSON.parse(
    fs.readFileSync(metadataPath, 'utf-8')
  )

  let hasChanges = false

  // Verificar cada arquivo do backup
  metadata.files.forEach(file => {
    const currentPath = path.join(ROOT_DIR, file)
    const backupPath = path.join(BACKUP_DIR, file)
    
    if (fs.existsSync(currentPath) && fs.existsSync(backupPath)) {
      const currentContent = fs.readFileSync(currentPath, 'utf-8')
      const backupContent = fs.readFileSync(backupPath, 'utf-8')
      
      if (currentContent !== backupContent) {
        console.log(chalk.yellow(`⚠️ Arquivo modificado: ${file}`))
        hasChanges = true
      }
    }
  })

  // Verificar estado do Git
  const currentHash = executeGit('git rev-parse HEAD', true).trim()
  if (currentHash && currentHash !== metadata.hash) {
    console.log(chalk.yellow('⚠️ Alterações detectadas no Git'))
    hasChanges = true
  }

  if (hasChanges) {
    console.log(chalk.yellow('\nAlguns arquivos críticos foram modificados.'))
    console.log(chalk.yellow('Use "npm run guard:restore" para restaurar o backup ou "npm run guard:backup" para atualizar o backup.'))
    process.exit(1)
  } else {
    console.log(chalk.green('\n✅ Todos os arquivos críticos estão íntegros!'))
  }
}

const command = process.argv[2]

switch (command) {
  case 'backup':
    backup()
    break
  case 'restore':
    restore()
    break
  default:
    check()
    break
} 

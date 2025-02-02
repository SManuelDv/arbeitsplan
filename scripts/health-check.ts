import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const ROOT_DIR = process.cwd()

function checkDependencies() {
  console.log(chalk.blue('📦 Verificando dependências...'))
  try {
    execSync('npm list', { stdio: 'ignore' })
    console.log(chalk.green('✓ Dependências OK'))
    return true
  } catch {
    console.log(chalk.yellow('⚠️ Algumas dependências podem estar faltando'))
    return false
  }
}

function checkConfigFiles() {
  console.log(chalk.blue('🔍 Verificando arquivos de configuração...'))
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'tailwind.config.js',
    '.env'
  ]

  const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(ROOT_DIR, file)))

  if (missingFiles.length > 0) {
    console.log(chalk.red(`❌ Arquivos faltando: ${missingFiles.join(', ')}`))
    return false
  }

  console.log(chalk.green('✓ Arquivos de configuração OK'))
  return true
}

function checkTypeScript() {
  console.log(chalk.blue('🔎 Verificando tipos TypeScript...'))
  try {
    execSync('npx tsc --noEmit', { stdio: 'ignore' })
    console.log(chalk.green('✓ TypeScript OK'))
    return true
  } catch {
    console.log(chalk.yellow('⚠️ Encontrados erros de TypeScript'))
    return false
  }
}

function checkGitStatus() {
  console.log(chalk.blue('🔄 Verificando estado do Git...'))
  try {
    execSync('git status', { stdio: 'ignore' })
    console.log(chalk.green('✓ Git OK'))
    return true
  } catch {
    console.log(chalk.yellow('⚠️ Git não configurado ou com problemas'))
    return false
  }
}

function main() {
  console.log(chalk.blue('🏥 Iniciando verificação de saúde do projeto...\n'))

  const checks = [
    checkDependencies(),
    checkConfigFiles(),
    checkTypeScript(),
    checkGitStatus()
  ]

  const allPassed = checks.every(check => check)

  if (allPassed) {
    console.log(chalk.green('\n✅ Todas as verificações passaram!'))
    process.exit(0)
  } else {
    console.log(chalk.yellow('\n⚠️ Algumas verificações falharam. Revise os avisos acima.'))
    process.exit(1)
  }
}

main() 
const fs = require('fs')
const path = require('path')
const db = require('../db')

async function runSqlFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8')
  // Split on semicolons not inside strings (naive split works for our simple files)
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'))
  console.log(`\n>>> Running migration: ${path.basename(filePath)} (${statements.length} statements)`)  
  for (const stmt of statements) {
    await new Promise((resolve, reject) => {
      db.query(stmt, (err) => {
        if (err) {
          console.error('Failed statement:', stmt)
          return reject(err)
        }
        resolve()
      })
    })
  }
}

async function main() {
  try {
    const dir = path.join(__dirname)
    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.sql'))
      .sort() // run in filename order
    if (files.length === 0) {
      console.log('No .sql migrations found.')
      process.exit(0)
    }
    for (const f of files) {
      await runSqlFile(path.join(dir, f))
    }
    console.log('\nAll migrations applied.')
    process.exit(0)
  } catch (err) {
    console.error('Migration run failed:', err)
    process.exit(1)
  }
}

main()

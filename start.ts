import * as fs from 'fs'
import * as Mustache from 'mustache'
import * as path from 'path'
import sh from 'shell-helper'
import * as shell from 'shelljs'

require('colors')

const helpText = `
=========================================================
=                                                       =
=              od-node-ts-starter setup                 =
=                                                       =
=========================================================

This script will clean and setup current repository with
shiny new names.

`.green

async function getNonEmptyAnswer (question): Promise<string> {
  let input: string
  do {
    input = await sh.getAnswer(question)
    input = input.trim()
  } while (input.length <= 0)
  return input
}

async function render (templateFileName, outputFilePath, data) {
  const template = fs.readFileSync(templateFileName).toString('utf-8')
  const rendered = Mustache.render(template, data)
  fs.writeFileSync(outputFilePath, rendered)
}

async function run () {
  console.log(helpText)

  const name = await getNonEmptyAnswer('Name of the project : '.white.bold)
  const author = await getNonEmptyAnswer('Author : '.white.bold)
  const description = await getNonEmptyAnswer('Description : '.white.bold)

  const confirmText = `
==================================
Name        : ${name.white.bold}
Author      : ${author.white.bold}
Description : ${description.white.bold}
==================================
`

  console.log(confirmText)
  const confirm = await sh.askYesNo(`Are you sure? `.red.bold)
  if (!confirm) {
    console.log('Cancelled.'.yellow)
    return
  }

  shell.cd(path.join(__dirname))
  shell.rm('-rf', 'coverage')
  shell.rm('-rf', '.git')
  shell.rm('-rf', '.idea')
  shell.rm('-rf', 'src')
  shell.rm('-rf', 'test')
  shell.rm('-rf', 'dist')
  shell.rm('-rf', 'node_modules')
  shell.rm('yarn.lock')

  shell.mkdir('-p', 'src')
  shell.mkdir('-p', 'test')

  const view = { name, author, description }
  await render(path.join(__dirname, 'templates/package.json.mustache'), path.join(__dirname, 'package.json'), view)
  await render(path.join(__dirname, 'templates/index.ts.mustache'), path.join(__dirname, 'src/index.ts'), view)
  await render(path.join(__dirname, 'templates/index.test.ts.mustache'), path.join(__dirname, 'test/index.test.ts'), view)

  shell.rm('-rf', 'templates')
  if (shell.which('yarn')) {
    shell.exec('yarn')
  } else {
    shell.exec('npm i')
  }

  shell.rm('start.ts')
  shell.exec('git init')
  shell.exec('git add .')
  shell.exec(`git commit -m"Initial setup for ${name}"`)
  console.log(`Finished`.white.bold)
}

run().catch(console.log.bind(console))

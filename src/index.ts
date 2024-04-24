import  { $ } from 'bun'

const params = process.argv.slice(2).map(x => {
    return x.toLowerCase()
}).join('-')
const name: string = await $`whoami`.text()

let gitBranchName = `${name.trim()}/${params}`

const { stdout, stderr, exitCode } = await $`git checkout -b ${gitBranchName}`.nothrow().quiet()

if (exitCode !== 0) {
    const error = String(stderr)
    if (error.includes('already exists')) {
        await $`git checkout ${gitBranchName}`.nothrow().quiet()
    }
}

import  { $ } from 'bun'

function formatArgs(args: string[]): string {
    return args.filter(x => {
        return x.length > 0
    })
    .map(x => {
        return x.replaceAll(/[^\w ]+/gi, '')
            .replaceAll(/[ ]+/gi, '-')
    })
    .join('-')
    .toLowerCase()
}

const params = process.argv.slice(2)
const name: string = await $`whoami`.text()

let gitBranchName = `${name.trim()}/${formatArgs(params)}`

const { stdout, stderr, exitCode } = await $`git checkout -b ${gitBranchName}`.nothrow().quiet()

if (exitCode !== 0) {
    const error = String(stderr)
    if (error.includes('already exists')) {
        await $`git checkout ${gitBranchName}`.nothrow().quiet()
    } else {
        console.log(`Oops: ${error}`)
    }
}

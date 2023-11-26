const fs = require('fs')
const { exec } = require('child_process')
const path = require('path')
const ejs = require('ejs')

async function replaceSelectedText(fileOptions){
    const { filePath, startComment, endingComment } = fileOptions
    let existingFileContent
    
    try{
        existingFileContent = fs.readFileSync(filePath, 'utf-8')
    }
    catch(e){
        console.error(e)
    }

    checkTextExists(startComment, existingFileContent)
    checkTextExists(endingComment, existingFileContent)

    const updatedFileContent = fillContent(existingFileContent, fileOptions)

    try{
        fs.writeFileSync(filePath, updatedFileContent)
    }
    catch(e){
        console.error(e)
    }    

    commitOptions = {
        filePath: filePath, 
        commitMessage: `Update file ${path.basename(filePath)}`
    }

    // console.log(fs.readFileSync(filePath, 'utf-8')) // For running locally
    await commitFile(commitOptions) // For running in prod

}

function checkTextExists(text, fileContent){
    if(!fileContent.includes(text)){
        throw new Error(`Text "${text}" not found in file`)
    }
}

function fillContent(existingFileContent, fileOptions){
    const { textToFill, startComment, endingComment } = fileOptions

    const fillRegex = new RegExp(`${startComment}([\\s\\S]*?)${endingComment}`,'g')
    const newContent = existingFileContent.replaceAll(fillRegex, `${startComment}\n${textToFill}\n${endingComment}`)
    return newContent
}

async function commitFile(options){
    const { filePath, commitMessage } = options

    await runExec(`git config --global 'user.name' 'Github Action Update File'`)
    await runExec(`git add ${filePath}`)
    await runExec(`git commit -m "${commitMessage}"`)
    await runExec(`git push`)
}

async function runExec(command){
    const execPromise = new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if(error){
                console.error(`Error: ${error}`)
                reject(error)
            }
            if(stderr){
                console.error(stderr)
            }

            console.log(`Command output: ${stdout}`)
            resolve(stdout)
        })
    })

    await execPromise
}

async function main(){
    
    let ejsTemplate
    try {
        ejsTemplate =  fs.readFileSync(process.env.EJS_TEMPLATE_PATH, 'utf-8')
    }
    catch(e) {
        console.error(e)
    }

    const jsonData = JSON.parse(process.env.TEMPLATE_INPUT_JSON)
    const textToFill = ejs.render(ejsTemplate, { jsonData })

    const fileOptions = {
        filePath: `${process.env.GITHUB_WORKSPACE}/${process.env.FILE_PATH}`,
        textToFill: textToFill,
        startComment: process.env.STARTING_COMMENT,
        endingComment: process.env.ENDING_COMMENT
    }
    
    await replaceSelectedText(fileOptions)
}

main()
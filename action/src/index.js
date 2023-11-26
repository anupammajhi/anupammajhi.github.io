const fs = require('fs')
const { exec } = require('child_process')
const path = require('path')

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
        // console.log(updatedFileContent)
        fs.writeFileSync(filePath, updatedFileContent)
    }
    catch(e){
        console.error(e)
    }    

    // console.log(fs.readFileSync(filePath, 'utf-8'))
    commitOptions = {
        filePath: filePath, 
        commitMessage: `Update file ${path.basename(filePath)}`
    }
    await commitFile(commitOptions)

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
    // const templateOptions = {
    //     inputJSON: process.env.INPUT_JSON,
    //     template: process.env.FILL_TEMPLATE
    // }

    let textToFill = "This is my blog"

    const fileOptions = {
        filePath: `${process.env.GITHUB_WORKSPACE}/${process.env.FILE_PATH}`,
        textToFill: textToFill,
        startComment: process.env.STARTING_COMMENT,
        endingComment: process.env.ENDING_COMMENT
    }
    
    await replaceSelectedText(fileOptions)
}

main()
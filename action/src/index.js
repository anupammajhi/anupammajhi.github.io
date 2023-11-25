const fs = require('fs')

async function replaceSelectedText(fileOptions){
    const { filePath, startComment, endingComment } = fileOptions
    let existingFileContent
    
    try{
        existingFileContent = fs.readFileSync(filePath, 'utf-8')
    }
    catch(e){
        console.log(e)
    }

    checkTextExists(startComment, existingFileContent)
    checkTextExists(endingComment, existingFileContent)

    const updatedFileContent = fillContent(existingFileContent, fileOptions)

    console.log(updatedFileContent)

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
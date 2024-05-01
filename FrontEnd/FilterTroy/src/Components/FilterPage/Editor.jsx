import React, { useState } from 'react'
import AceEditor from "react-ace";
import "./Theme/Editor.scss"

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-language_tools"

const Editor = (props) => {
    const [code, setCode] = useState('')
    return (
        <div className='Editor'>
            <div className='EditorHeader'>
                <div className='EditorTitle'>{props.title}</div>
                <div className='EditorHeaderButtonContainer'>
                    <button className='EditorButton'>Save</button>
                    <button className='EditorButton'>Run</button>
                </div>
            </div>
            <div className='EditorContainer'>
                <AceEditor
                    mode={props.mode}
                    theme="solarized_light"
                    name="editor"
                    placeholder={props.desc}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    enableLiveAutocompletion={true}
                    enableSnippets={true}
                    width='100%'
                    height='100%'
                    value={code}
                    onChange={(value) => setCode(value)}
                />
            </div>
            <div className='EditorInfoContainer'>
                <div className='EditorInfo'>Number of Chars: {code.length}</div>
                {props.includeTime && <div className='EditorInfo'>Compilation Time: 1s</div>}
            </div>
        </div>
    )
}

export default Editor
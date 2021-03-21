import React, {Component} from 'react';

import Dropzone from 'react-dropzone';

import {DropContainer, UploadMessage} from './styles';

export default class Upload extends Component{
    renderDragMessage = (isDragActive, isDragReject) => {
        if(!isDragActive){
            return <UploadMessage>Clique para adicionar arquivos</UploadMessage>
        }

        if(isDragReject){
            return <UploadMessage type='erro'>Arquivo nao suportado</UploadMessage>
        }

        return <UploadMessage type='success'>Solte os arquivos</UploadMessage>
    }

    render(){
        const {onUpload} = this.props;

        const accept = [
            'image/*',
            'video/*'
        ]

        return(
            <Dropzone accept={accept} onDropAccepted={onUpload}>
                {({getRootProps, getInputProps, isDragActive, isDragReject}) => (
                    <DropContainer
                        {...getRootProps()}
                        isDragActive={isDragActive}
                        isDragReject={isDragReject}
                    >
                        <input {...getInputProps()}/>

                        {this.renderDragMessage(isDragActive, isDragReject)}
                    </DropContainer>
                       
                )}
            </Dropzone>
        )
    }
}
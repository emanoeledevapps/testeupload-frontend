import React, {Component} from 'react';
import {uniqueId} from 'lodash';
import filesize from 'filesize';
import GlobalStyle from './Components/styles/global';
import {
  Container, 
  Content, 
  ContainerList, 
  TextDefault, 
  BtnVoltar, 
  View, 
  Loading, 
  TituloInfo,
  Manutencao,
  TextManutencao,
  View3,
  ViewBlock,
  Input,
} from './styles';
import Upload from './Components/Upload';
import FileList from './Components/FileList';
import api from './Services/api';
import { ViewInfo } from './Components/FileList/styles';

export default class App extends Component{
  state = {
    uploadedFiles: [],
    selectPerfil: true,
    selectProfessor: true,
    selectSemana: false, 
    professor: '',
    aluno: '',
    semana: '',
    listaAlunos: [],
    listaSemanas: [],
    loading: false,
    manutencao: process.env.REACT_APP_MANUTENCAO,
    bloqueado: true,
    senha: process.env.REACT_APP_SENHA,
    input: ''
  }

  async buscaSemanas(){
    this.setState({loading: true})
    const response = await api.get("/semanas");

    this.setState({listaSemanas: response.data})

    console.log(response.data)
    this.setState({loading: false})
  }

  async BuscaAlunos(professor){
    this.setState({loading: true})

    const response = await api.get(`/alunos/${professor}`);

    this.setState({listaAlunos: response.data})

    console.log(this.state.listaAlunos)
    this.setState({loading: false})
  }

  async buscaUploadedFiles(aluno, semana) {
    const response =  await api.get(`/posts/${this.state.professor}/${aluno}/${semana}`);;

    this.setState({
      uploadedFiles: response.data.map(file => ({
        id: file._id,
        name: file.name,
        readableSize: filesize(file.size),
        preview: file.url,
        uploaded: true,
        url: file.url,

      }))
    })
  }

  componentWillUnmount(){
    this.state.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }

  handleUpload = files => {
    const uploadedFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null
    }))

    this.setState({
      uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
    });

    uploadedFiles.forEach(this.processUpload);
  };

  updateFile = (id, data) => {
    this.setState({uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
      return id === uploadedFile.id ? {...uploadedFile, ...data} : uploadedFile
    })})
  }

  processUpload = (uploadedFile) => {
    const data = new FormData();

    data.append('file', uploadedFile.file, uploadedFile.name);

    api.post(`/posts/${this.state.professor}/${this.state.aluno}/${this.state.semana}`, data, {
      onUploadProgress: e => {
        const progress = parseInt(Math.round(e.loaded * 100 / e.total));

        this.updateFile(uploadedFile.id, {
          progress,
        })
      }
    }).then(response => {
      this.updateFile(uploadedFile.id, {
        uploaded: true,
        id: response.data._id,
        url: response.data.url
      });
    }).catch(() => {
      this.updateFile(uploadedFile.id, {
        error: true
      });
    })
  };

  handleDelete = async id => {
    await api.delete(`/posts/${id}`);

    this.setState({
      uploadedFiles: this.state.uploadedFiles.filter(file => file.id != id)
    })
  }

  autenticacao(){
    const {input, senha} = this.state;
    if(input === senha){
      this.setState({bloqueado: false})
    }else{
      alert('Senha de acesso incorreta!')
    }
  }

  render(){
    
    const {bloqueado, uploadedFiles, selectPerfil, selectProfessor, selectSemana, listaAlunos, listaSemanas, loading, manutencao} = this.state;

    if(manutencao === 'true'){
      return(
        <Manutencao>
          <TextManutencao>Sistema em manutenção!<p>Por favor, tente novamente mais tarde!</p></TextManutencao>
          
          <GlobalStyle/>
        </Manutencao>
      )
    }else{
    return (
      <Container>
        {bloqueado ? (
          <ViewBlock>
          
            <Input 
              type="text" 
              placeholder="Digite a senha de acesso"
              onChange={(text) => this.setState({input: text.target.value})}
            />

            <button onClick={() => this.autenticacao()}>Acessar</button>

            <GlobalStyle/>
          </ViewBlock>
        ) : (
          <View3>
            {loading ? (
          <View>
            <Loading>Carregando items</Loading>
          <GlobalStyle/>
          </View>
        ) : (
          <ViewInfo>
            {selectPerfil ? (
          <Content>
            {selectProfessor ? (
              <div>
              <TituloInfo>Selecione um perfil:</TituloInfo>

              <ContainerList>
              <TextDefault onClick={() => {
                  const nameprofessor = 'DucileneLacerda'
                  this.setState({professor: 'DucileneLacerda', selectProfessor: false})
                  this.BuscaAlunos(nameprofessor)
                }}>Ducilene Lacerda
              </TextDefault>
              </ContainerList>
              
              <ContainerList>
              <TextDefault onClick={() => {
                  const nameprofessor = 'EliasMorais'
                  this.setState({professor: 'EliasMorais', selectProfessor: false})
                  this.BuscaAlunos(nameprofessor)
                }}>Elias Morais
              </TextDefault>
              </ContainerList>

              <ContainerList>
              <TextDefault onClick={() => {
                  const nameprofessor = 'MariaLucinda'
                  this.setState({professor: 'MariaLucinda', selectProfessor: false})
                  this.BuscaAlunos(nameprofessor)
                }}>Maria Lucinda
              </TextDefault>
              </ContainerList>

              <ContainerList>
              <TextDefault onClick={() => {
                  const nameprofessor = 'MariaNatividade'
                  this.setState({professor: 'MariaNatividade', selectProfessor: false})
                  this.BuscaAlunos(nameprofessor)
                }}>Maria Natividade
              </TextDefault>
              </ContainerList>

              <ContainerList>
              <TextDefault onClick={() => {
                  const nameprofessor = 'MauricioValdivino'
                  this.setState({professor: 'MauricioValdivino', selectProfessor: false})
                  this.BuscaAlunos(nameprofessor)
                }}>Mauricio Valdivino
              </TextDefault>
              </ContainerList>

              <ContainerList>
              <TextDefault onClick={() => {
                  const nameprofessor = 'Simone'
                  this.setState({professor: 'Simone', selectProfessor: false})
                  this.BuscaAlunos(nameprofessor)
                }}>Simone
              </TextDefault>
              </ContainerList>

              <ContainerList>
              <TextDefault onClick={() => {
                  const nameprofessor = 'Valeriana'
                  this.setState({professor: 'Valeriana', selectProfessor: false})
                  this.BuscaAlunos(nameprofessor)
                }}>Valeriana
              </TextDefault>
              </ContainerList>

              </div>
            ) : (
              <div>

                {selectSemana ? (
                  <div>
                    
                    <BtnVoltar onClick={() => this.setState({selectSemana: false})}>Voltar</BtnVoltar>
                    
                    <TituloInfo>Selecione a semana de aula:</TituloInfo>

                    {listaSemanas.map(semana => {
                      const nomesemana = semana.semana;
                      const {aluno} = this.state;

                      return(
                        <ContainerList key={semana._id}>
                        <div>
                          <TextDefault onClick={() =>{
                            this.setState({selectPerfil: false, semana: nomesemana})
                            this.buscaUploadedFiles(aluno, nomesemana)
                          }}>{nomesemana}</TextDefault>
                        </div>
                        </ContainerList>
                      )
                    })}
                  </div>
                ) : (
                  <div>
                    <BtnVoltar onClick={() => this.setState({selectProfessor: true})}>Voltar</BtnVoltar>
                    <TituloInfo>Selecione uma Opção:</TituloInfo>

                    {listaAlunos.map(aluno => {
                       const nomeAluno = aluno.aluno;
                        return(
                          <ContainerList key={aluno._id}>
                          <div>
                            <TextDefault onClick={async () => {
                              this.setState({aluno: aluno.aluno, selectSemana: true})
                              this.buscaSemanas()
                            }}>{aluno.aluno}</TextDefault>
                          </div>
                          </ContainerList>
                        )
                    })}
                  </div>
                )}

              
              
              </div>
            )}


          </Content>
        ) : (
          <Content>
          <BtnVoltar onClick={() => this.setState({selectPerfil: true, selectSemana: true})}>Voltar</BtnVoltar>
          <Upload onUpload={this.handleUpload}/>
  
            {!!uploadedFiles.length && (
              <FileList files={uploadedFiles} onDelete={this.handleDelete}/>
              
          )}
  
          </Content>
        )}
        
        <GlobalStyle/>
          </ViewInfo>
        )}
          </View3>
        )}
        

        
      </Container>
      )
    
    
    }
  }
}
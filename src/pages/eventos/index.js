import React, { useEffect, useState } from 'react';
import { Carousel, Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { db, storage } from "../../utils/firebaseConfig";
import FileUploader from "react-firebase-file-uploader";

const EventosPage = () => {

    const [eventos, setEventos] = useState([]);
    const [nome, setNome] = useState('');
    const [ id, setId] = useState('');
    const [descricao, setDescricao] = useState('');
    const [urlImagem, setUrlImagem] = useState('');

    const dbCollection = db.collection('eventos')

    useEffect( () => {
        listarEventos()
    },[])

    const listarEventos = () => {
        try {
            dbCollection.get()
            .then(result => {
                const data = result.docs.map(doc => {
                    return{
                        id : doc.id,
                        nome : doc.data().nome,
                        descricao : doc.data().descricao,
                        urlImagem : doc.data().urlImagem
                    }
                });
                setEventos(data)
            })
            .catch(erro => console.error(erro))
        } catch (error) {
            console.error(error);
        }
    }

    const editar = (event) => {
        event.preventDefault()

        try {
            dbCollection.doc(event.target.value)
            .get()
            .then(result => {
                setId(result.id);
                setNome(result.data().nome);
                setDescricao(result.data().descricao)
                setUrlImagem(result.data().urlImagem)
            })
        } catch (error) {
            console.error(error)
        }
    }

    const remover = (event) => {
        event.preventDefault()

        try {
            dbCollection.doc(event.target.value).delete()
            .then(result => {
                alert('Evento removido');
                listarEventos()
            })
        } catch (error) {
            console.error(error)
        }
    }

    const salvar = (event) => {
        event.preventDefault();

        try {
            const evento = {
                nome : nome,
                descricao : descricao,
                urlImagem : urlImagem
            };
    
            if(id === 0)
            {
                dbCollection.add(evento)
                .then(() => {
                    alert('evento cadastrado!');
                    listarEventos()
                })
                .catch(err => console.error(err))
            }else{
                dbCollection.doc(id)
                .set(evento)
                .then(result => {
                    alert('evento alterado');
                    listarEventos();
                    limparCampos();
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const limparCampos = () => {
        setId(0);
        setNome('');
        setDescricao('');
    }

    const handleUploadError = error => {
        console.error(error)
    }
    const handleUploadSuccess = filename => {
        console.log('success '+ filename)
        
        storage
            .ref('imagens')
            .child(filename)
            .getDownloadURL()
            .then(url => {setUrlImagem(url)})
            .catch(err => console.error(err))
    } 


    return(
        <div>
            <Container>
                <h1>Eventos</h1>
                <p>Gerencie seus eventos!</p>
                <Card>
                        <Card.Body>
                        <Form onSubmit={event => salvar(event)}>
                            <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer'}}>
                                Selecione uma imagem
                                <Form.Group>
                                    {urlImagem && <img src={urlImagem} style={{width : '200px'}} />}
                                    <FileUploader
                                        hidden
                                        accept='image/*'
                                        name='urlImagem'
                                        randomizeFilename
                                        storageRef={storage.ref('imagens')}
                                        onUploadError={handleUploadError}
                                        onUploadSuccess={handleUploadSuccess}                                        
                                    />
                                </Form.Group>
                            </label>

                            <Form.Group controlId="formNome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" value={nome} onChange={event => setNome(event.target.value)} />
                            </Form.Group>
                            
                            <Form.Group controlId="formDescricao">
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control as="textarea" rows={3} value={descricao} onChange={event => setDescricao(event.target.value)} />
                            </Form.Group>
                            
                            <Button type="submit" >Salvar</Button>
                        </Form>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>imagem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    eventos.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.nome}</td>
                                            <td>{item.descricao}</td>
                                            <td><img src={item.urlImagem} style={{width : "150px"}} /></td>
                                            <td>
                                                <Button type="button" variant="warning" value={item.id} onClick={ event => editar(event)}>Editar</Button>
                                                <Button type="button" variant="danger" value={item.id} style={{ marginLeft : '30px'}} onClick={ event => remover(event)}>Remover</Button>
                                            </td>
                                        </tr>
                                    )
                                    })
                                }
                            </tbody>
                        </Table>
                        </Card.Body>
                    </Card>
            </Container>
        </div>
    )
    
}

export default EventosPage
import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Container, Form, SubmitButton, List } from './style';

import api from '../../services/api';

export default class Main extends Component{
    state = {
        newRepo: "",
        repositories: [],
        loading: false,
    };

    handleInput = e => {
        this.setState({ newRepo: e.target.value });
    }

    handleSubmit = async e => {
        e.preventDefault();
        this.setState({ loading: true });
        const { newRepo, repositories } = this.state;

        const response = await api.get(`repos/${newRepo}`);

        const data = {
            id: response.data.id,
            name: response.data.full_name
        }

        this.setState({
            newRepo: '',
            repositories: [...repositories, data]
        })
        this.setState({ loading: false });
        console.log(this.state);
    }

    componentDidMount(){
        const repositories = localStorage.getItem('repositories');

        if (repositories){
            this.setState( {repositories: JSON.parse(repositories)} );
        }
    }

    componentDidUpdate(_, oldState){
        if (oldState.repositories != this.state.repositories){
            localStorage.setItem('repositories', JSON.stringify(this.state.repositories));
        }
    }

    render() {
        const { newRepo, repositories } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit}>
                    <input 
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInput}    
                    />

                    <SubmitButton loading={this.state.loading}>
                        { this.state.loading ? <FaSpinner color="white" size={15}/> : <FaPlus color="white" size={15}/> }
                    </SubmitButton>
                </Form>

                <List>
                    {repositories.map(repo => (
                        <li key={repo.id}>
                            <span>{repo.name} </span>
                            <Link to={`/repository/${encodeURIComponent(repo.name)}`}>Detalhes</Link>
                        </li>
                    ))}
                </List>
            </Container>
            
        );
    }
}
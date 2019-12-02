import React, { Component } from 'react';
import { Table, InputGroup, Button, FormControl, ToggleButtonGroup, ToggleButton, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { serverURL } from '../../config';
import CustomRating from '../Common/CustomRating';
import ReactPaginate from 'react-paginate';
import { ModalKey } from '../../constants/ModalKeys';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      page: 1,
      users: [],
      userRole: 'COOK',
      pages: [],
      lastPage: 1
    }
  }

  componentDidMount() {
    let data = {
      role: this.state.userRole,
      searchQuery: this.state.search
    }
    axios.post(`${serverURL}/getnumberofusers`, { data })
      .then(res => {
        this.setState({
          lastPage: res.data.data.numUsers,
          page: 1
        });
      })
    data = {
      role: this.state.userRole,
      page: 1,
      searchQuery: this.state.search
    }
    axios.post(`${serverURL}/getallusers`, { data })
      .then(res => {
        this.setState({
          users: Array.from(res.data.data)
        });
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userRole !== this.state.userRole) {
      let data = {
        role: this.state.userRole,
        searchQuery: this.state.search
      }
      axios.post(`${serverURL}/getnumberofusers`, { data })
        .then(res => {
          this.setState({
            lastPage: res.data.data.numUsers,
            page: 1
          });
        })
      data = {
        role: this.state.userRole,
        page: this.state.page,
        searchQuery: this.state.search
      }
      axios.post(`${serverURL}/getallusers`, { data })
        .then(res => {
          this.setState({
            users: Array.from(res.data.data)
          });
        })
    }
    else if(prevState.page !== this.state.page) {
      const data = {
        role: this.state.userRole,
        page: this.state.page,
        searchQuery: this.state.search
      }
      axios.post(`${serverURL}/getallusers`, { data })
        .then(res => {
          this.setState({
            users: Array.from(res.data.data)
          });
        })
    }
  }

  handleSearchChange = e => {
    this.setState({
      search: [e.target.value]
    })
  }

  handleSearchSubmit = e => {
    let data = {
      role: this.state.userRole,
      searchQuery: this.state.search
    }
    axios.post(`${serverURL}/getnumberofusers`, { data })
        .then(res => {
          this.setState({
            lastPage: res.data.data.numUsers,
            page: 1
          });
        })
      data = {
        role: this.state.userRole,
        page: this.state.page,
        searchQuery: this.state.search
      }
      axios.post(`${serverURL}/getallusers`, { data })
        .then(res => {
          this.setState({
            users: Array.from(res.data.data)
          });
        })
  }

  handleRoleChange = e => {
    this.setState({
      userRole: e
    })
  }

  handlePageChange = pageNum => {
    this.setState({
      page: pageNum
    })
  }

  handleUserClick = user => {
    const { openModal } = this.props;
    openModal(ModalKey.BAN_PROFILE, { ...user });
  }

  getShownPages = () => {
    const { page, lastPage } = this.state;
    let pages = [];
    if(page <= 1 && lastPage <= 1) {
      return [1];
    }
    if(page <= 2 && lastPage < 6) {
      pages = Array.from(Array(lastPage+1).keys()).slice(1, lastPage+1);
    }
    else if(page <= 2) {
      pages = Array.from(Array(6).keys()).slice(1, 6);
    }
    else if(lastPage - page < 3) {
      pages = Array.from(Array(lastPage + 1).keys()).slice(page-2, lastPage+1);
    }
    else {
      pages = Array.from(Array(lastPage + 1).keys()).slice(page-2, page+3);
    }
    
    return pages;
  }

  render() {
    const { search, users, userRole, page, lastPage } = this.state;
    const pages = this.getShownPages();
    return (
      <div className="userlist-container">
        <div className="searchbar-container">
          <InputGroup className="mb-3" className="searchbar-input">
            <FormControl type="text" placeholder="Search" onChange={this.handleSearchChange} value={search} />
            <InputGroup.Append>
              <Button className="searchbar-button" variant="outline-secondary" onClick={this.handleSearchSubmit}>Search</Button>
            </InputGroup.Append>
          </InputGroup>
          <ToggleButtonGroup defaultValue="COOK" className="multi-checkbox-div" name="user_role" type="radio" value={userRole} onChange={this.handleRoleChange}>
            <ToggleButton variant="outline-dark" className="single-checkbox" value="COOK">Homecook</ToggleButton>
            <ToggleButton variant="outline-dark" className="single-checkbox" value="CUSTOMER">Customer</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <Pagination>
          <Pagination.First disabled={page === 1}  onClick={e => this.handlePageChange(1)}/>
          <Pagination.Prev disabled={page === 1}  onClick={e => this.handlePageChange(page-1)}/>
          {!pages.includes(1) ? <Pagination.Item onClick={e => this.handlePageChange(1)}>{1}</Pagination.Item> : null}
          {!pages.includes(1) ? <Pagination.Ellipsis disabled /> : null}
          {pages.map((newPage) =>
              <Pagination.Item active={newPage === page} onClick={e => this.handlePageChange(newPage)}>{newPage}</Pagination.Item>
          )}
          {!pages.includes(lastPage) ? <Pagination.Ellipsis disabled /> : null}
          {!pages.includes(lastPage) ? <Pagination.Item onClick={e => this.handlePageChange(lastPage)}>{lastPage}</Pagination.Item> : null}
          <Pagination.Next disabled={page === lastPage} onClick={e => this.handlePageChange(page+1)}/>
          <Pagination.Last disabled={page === lastPage}  onClick={e => this.handlePageChange(lastPage)}/>
        </Pagination>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user =>
              <tr onClick={e => this.handleUserClick(user)}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{<CustomRating rating={user.rating} readonly={true} bowlSize={"25px"} />}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default UserList;
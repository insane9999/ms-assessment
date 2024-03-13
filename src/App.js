import './App.css';
import { Button, Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import { addUser, clearUsers, getLocations, getUsers, isNameValid } from './mock-api/apis';
import { useForm } from 'react-hook-form';

const ERROR_MESSAGES = {
  name: 'this name has already been taken'
}

function App() {

  const { handleSubmit, register, setError, clearErrors, formState: { errors } } = useForm();
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);

  /**
   * component mount life cycle
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setUsers(await getUsers());
        setLocations(await getLocations());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);


  /**
   * submit form data to mock server
   * @param {*} data 
   */
  const onSubmit = (data) => {
    addUser(data).then((ret) => {
      if (ret) {
        setUsers([...users, data]);
      }
    })
  }

  /**
   * clear list on mock server
   */
  const clearList = () => {
    clearUsers().then(() => {
      setUsers([]);
    })
  }

  /**
   * prevent ENTER key event
   * @param {*} event 
   */
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
    }
  };

  /**
   * name validator using mock api
   * @param {*} name 
   * @returns 
   */
  const nameValidator = async (name) => (await isNameValid(name));

  return (
    <div className="App">
      <Container>
        <Form className='mb-8' onSubmit={handleSubmit(onSubmit)}>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2" className="text-right">
              Name
            </Form.Label>
            <Col sm="10">
              <Form.Control
                {...register("name", { required: true, validate: nameValidator })}
                isInvalid={errors.name}
                onKeyDown={handleKeyPress}
                onChange={(e) => {
                  nameValidator(e.target.value).then((ret) => {
                    if (!ret) {
                      setError('name');
                    } else {
                      clearErrors('name');
                    }
                  });
                }}
              />

              {
                errors.name && (
                  <Form.Control.Feedback type="invalid">
                    {ERROR_MESSAGES['name']}
                  </Form.Control.Feedback>
                )
              }
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
            <Form.Label column sm="2" className="text-right">
              Location
            </Form.Label>
            <Col sm="10">
              <Form.Select
                {...register('location')}
                defaultValue={locations[0]}
              >
                {
                  locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))
                }
              </Form.Select>
            </Col>
          </Form.Group>

          <div className="d-flex justify-content-end mb-8">
            <Button variant="secondary" className='mr-4' onClick={clearList}>Clear</Button>
            <Button variant="primary" type="submit">Add</Button>
          </div>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.location}</td>
                </tr>
              ))
            }
            {
              users.length === 0 && (
                <tr>
                  <td colSpan={2}>No Data</td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </Container>
    </div >
  );
}

export default App;

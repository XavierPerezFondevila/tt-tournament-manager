import { IconUser } from '@/icons/IconUser';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './styles.css'; 
import { getUser } from '@/actions/data';
import { useRouter } from 'next/router';

function LoginForm() {
  const router = useRouter(); 
  // const user = getUser('xavi.perez', 'xavi.perez');

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const nick = formData.get('nick');
    const password = formData.get('password');

    const user = getUser(nick, password);
    router.redirect('/');

  };


  return (
      <Dropdown className='login-form-module'>
        <Dropdown.Toggle id="login-form" className='dropdown-open d-flex gap-2'>
        <IconUser className="user-icon action-btn"/> Iniciar sesión
        </Dropdown.Toggle>
  
        <Dropdown.Menu className='login-form-wrapper' align="end">
          <Form className='py-2 px-3' onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nick</Form.Label>
              <Form.Control type="text" placeholder="Entra el nick" name="nick" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Contraseña" name="password"/>
            </Form.Group>
            <Button variant="primary" type="submit" className='w-100'>
              Entra
            </Button>
          </Form>
        </Dropdown.Menu>
      </Dropdown>
  );
}

export default LoginForm;
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const defaultTheme = createTheme();

export default function AuthPage({notifyAuthorized}) {
  const [registered, setRegistered] = React.useState(false);
  const [warning, setWarning] = React.useState(false);
  const [warningText, setWarningText] = React.useState('');

  const handleSignUp = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let users = JSON.parse(localStorage.getItem('users'));
    if (users.find(e => e.email == data.get('email'))) {
        setWarningText('Пользователь уже существует!');
        setWarning(true);

        return;
    }

    const user = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
      role: 'пользователь',
      active: true
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('profile', JSON.stringify(user));

    notifyAuthorized();
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email == data.get('email') && u.active);
    if (!user) {
        setWarningText('Пользователя не существует!');
        setWarning(true);

        return;
    }

    localStorage.setItem('profile', JSON.stringify(user));

    notifyAuthorized();
  };

  const handleRegistered = () => {
    setRegistered(!registered);
  };

  const handleCloseWarning = () => {
    setWarning(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {registered && <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Вход
          </Typography>
          <Box component="form" onSubmit={handleSignIn} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField id="email" label="Электронная Почта" name="email" type="email" required fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField id="password" label="Пароль" name="password" type="password" required fullWidth />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Войти
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component="button" variant="body2" onClick={handleRegistered}>
                  Не зарегистрированы? Регистрация
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>}
      {!registered && <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <Box component="form" onSubmit={handleSignUp} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField id="firstName" name="firstName" label="Имя" required fullWidth autoFocus />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField id="lastName" label="Фамилия" name="lastName" required fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField id="email" label="Электронная Почта" name="email" type="email" required fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField id="password" label="Пароль" name="password" type="password" required fullWidth />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Зарегистрироваться
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component="button" variant="body2" onClick={handleRegistered}>
                  Уже зарегистрированы? Войти
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>}
      <Snackbar open={warning} autoHideDuration={3000} onClose={handleCloseWarning}>
        <Alert onClose={handleCloseWarning} severity="error" variant="filled" sx={{ width: '100%' }}>
            {warningText}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
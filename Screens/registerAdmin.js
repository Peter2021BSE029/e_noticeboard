import { auth, createUserWithEmailAndPassword, ref, set, database } from '../Firebase/firebase';

const registerAdmin = () => {
  const email = 'admin@example.com';
  const password = 'admin123';
  const role = 'admin';

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Store user role in the database
      set(ref(database, `users/${user.uid}`), {
        email: email,
        role: role,
      }).then(() => {
        console.log('Admin user created successfully!');
      });
    })
    .catch((error) => {
      console.error('Error creating admin user: ', error);
    });
};

// Call the function to register the admin user
registerAdmin();
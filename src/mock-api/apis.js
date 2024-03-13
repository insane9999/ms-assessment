let userDB = [];

/**
 * do not change the implementation
 */
// export const isNameValid = (name) => new Promise((resolve) => {
//     setTimeout(() => {
//         resolve(name !== 'invalid name');
//     }, Math.random() * 2000);
// });

export const isNameValid = (name) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(!userDB.find((u) => u.name === name))
    }, 100);
});

/**
 * do not change the implementation
 */
export const getLocations = () => Promise.resolve(['Canada', 'China', 'USA', 'Brazil']);

export const getUsers = () => new Promise((resolve) => {
    setTimeout(() => {
        resolve(userDB);
    }, Math.random() * 1000);
});

export const addUser = (data) => new Promise((resolve) => {
    if (!userDB.find((u) => u.name === data.name)) {
        userDB = [...userDB, data];
        resolve(true);
    } else {
        resolve(false);
    }
});

export const clearUsers = () => new Promise((resolve) => {
    userDB = [];
    resolve(true);
})
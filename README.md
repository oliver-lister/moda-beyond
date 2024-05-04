# MØDA-BEYOND E-Commerce Store

A full-stack e-commerce store, where customers can browse a wide array of clohting products across mens, womens and kids categories. Users can easily create an account, assemble their shopping cart, and securely process payments through the Stripe API, collecting shipping information along the way.

This project is a personal portfolio project, and not intended for any commerical use. All Stripe payments are run in test mode and no money will be charged.

## Table of Contents

1. <a href=#setup>Setup</a>
2. <a href=#technologies-used>Technologies Used</a>
3. <a href=#features>Features</a>
4. <a href=#acknowledgements>Acknowledgements</a>

## Setup

_<a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">Node package manager (npm) and node.js</a> are required for setup._

### Run Frontend Locally using the Render-hosted Backend

Unfortunately you <b>cannot</b> run the backend locally at full functionality without the keys and secrets in my backend's .env file which is ignored by git.

To avoid problems, I recommend running the frontend in production mode by:

1. Changing directory into frontend folder.
2. Installing dependencies
3. Running build command
4. Exposing the build on a localhost port for viewing.

<!-- end of the list -->

    cd frontend
    npm install
    npm run build
    npx vite preview

This will connect your frontend running on your localhost server with the backend hosted by <a href="https://render.com/">render</a>.

_Note: The frontend is currently pointed to a backend hosted by <a href="https://render.com/">render</a> on a free instance. This means it will spin down with inactivity, which can delay requests by 50 seconds or more. Please allow a minute for the backend to warmup on start-up before testing any functionality._

### Admin (Custom CMS)

The same situation presents itself with the admin frontend, again please run it in production mode via the below commands:

    cd admin
    npm install
    npm run build
    npx vite preview

## Technologies Used

### Frontend:

| Resources   | What was Used                                                              |
| ----------- | -------------------------------------------------------------------------- |
| Language/s  | HTML, CSS, Typescript                                                      |
| Framework/s | React.js                                                                   |
| Tools       | Vite, Redux Toolkit, MantineCSS, Stripe API, Vitest, React Testing Library |

### Admin CMS:

| Resources   | What was Used         |
| ----------- | --------------------- |
| Language/s  | HTML, CSS, Typescript |
| Framework/s | React.js              |
| Tools       | Vite, MantineCSS      |

### Backend:

| Resources   | What was Used                                |
| ----------- | -------------------------------------------- |
| Language/s  | Typescript                                   |
| Framework/s | Node.js, Express.js                          |
| Tool/s      | dotEnv, Mongoose, Multer, JWT, Nodemon, uuid |
| Database    | MongoDB                                      |

## Features

### Cart

The cart is built around using a local state controlled by Redux Toolkit, in cartSlice.ts. This cartState has a few key-value pairs:

    export const initialCartState: CartState = {
        items: [],
        totalItems: 0,
        isLoading: false,
    };

and reducers which allow you to:

1. Add items to your cart
2. Remove items from your cart
3. Clear your cart
4. Update the size of an item in your cart
5. Update the quantity of an item in your cart

When a user opens the webpage, a useEffect in the Layout.tsx page (the root layout page) completes the following set of conditional statements:

1. Checks whether the user is logged in (user.data is not null) and if so, sets the cart to the user's cart data stored in the database.
2. If the user is not logged in, but there's cart data stored in the localStorage API, it sets the cart data to that.
3. If neither of these checks result to true, it relys on the default cartState which is an empty array [] for cart.items.

<!-- end of the list -->

    useEffect(() => {
        const localCart = localStorage.getItem("cart");

        if (!user.data && !localCart) {
        return;
        }

        if (user.data) {
        dispatch(setCart(user.data.cart));
        return;
        }

        if (localCart) {
        dispatch(setCart(JSON.parse(localCart)));
        return;
        }
    }, [user.data, dispatch]);

When a user is logged in, and any change is made to their local cart, a reducer is dispatched via a RDTK Async Thunk to update the user's cart data in the database.

    useEffect(() => {
        if (auth.isAuthenticated) {
        dispatch(updateDBCartAsync(cart));
        }
    }, [cart, auth.isAuthenticated, dispatch]);

That way, the data stored on the database is always up to date with what the user is being shown live, and as the cart state is stored locally, there is no delay when the user makes changes to their cart.

#### Comprehensive Cart Logic

When designing the RDTK cartSlice reducers, a few edge cases became visible to me:

1.  What happens when a user has two cart items of the same product, but with differing size values...
    <br><br>
    i.e. 1x INTL M Red Shorts, and 1x INTL L Red Shorts.
    <br><br>
    If the user decides to change the size on one of the two items to make them both match (e.g. INTL M becomes INTL L). Without proper logic, this edge case would result in two cart item entries for what should just be one:
    <br><br>
    i.e. 1x INTL L Red Shorts, and 1x INTL L Red Shorts.
    <br><br>
    When ideally, it should result in:
    <br><br>
    i.e. 2x INTL L Red Shorts.
    <br><br>
    To implement this functionality, I had to first search the existing cart to see if an item of the same properties existed (same productId, color and size). This below function finds the index of the first item that returns a true in the conditional statement.

        const sameItemIndex = state.items.findIndex((item, index) => {
            if (index === itemToUpdateIndex) return false;
            return (
            item.productId === itemToUpdate.productId &&
            item.size === newSize &&
            item.color === itemToUpdate.color
            );
        });

## Acknowledgements

This project orginated from a tutorial from <a href="https://www.youtube.com/@GreatStackDev">GreatStack</a> on YouTube called:
<a href="https://www.youtube.com/watch?v=y99YgaQjgx4">How To Create Full Stack E-Commerce Website Using React JS, MongoDB, Express & Node JS 2024</a>. Once reviewing and implementing GreatStack's build, I diverged on my own project to create a more efficient, detailed and better looking product:

- I also decided to build the entire project in <a href="https://www.typescriptlang.org/">TypeScript</a>, which I had never used prior.
- I used the <a href="https://mantine.dev/">MantineCSS</a> component library for the first time, which after doing research I found it paired well with CSS modules.
- Instead of using React's <a href="https://react.dev/learn/scaling-up-with-reducer-and-context">Context API</a>, I learned and used <a href="https://redux-toolkit.js.org/">Redux Tookit</a> for global state management. This also involved learning Async Thunks.
- In the Frontend, I created more comprehensive account routes for accessing user data, and impressive cart and payment functionality.
- In the Backend, I created a more complex authenication process which allowed for database sessions and refresh tokens.
- I also found GreatStack, occasionaly strayed from best design and code practices and took some shortcuts which would lead to scalabilities issues down the line.

For products, I used content, and images from <a href="https://www.theiconic.com.au/">TheICONIC</a>. TheICONIC also was a key design inspiration for a lot of the website, e.g. NavBar and ProductDisplay component. I also took some inspiration from the way <a href="https://www.catch.com.au/">Catch.com.au</a> designed their Cart. For banner images, I used <a href="https://unsplash.com/">UnSplash</a>.

# MØDA-BEYOND E-Commerce Store

A full-stack e-commerce store, where customers can browse a wide array of
clothing products across mens, womens and kids categories. Users can easily
create an account, assemble their shopping cart, and securely process payments
through the Stripe API, collecting shipping information along the way.

This project is a personal portfolio project, and not intended for any
commerical use. All Stripe payments are run in test mode and no money will be
charged.

<a href="https://www.oliver-lister.github.io/moda-beyond/">
  <img alt="MØDA-BEYOND" src="https://www.oliver-lister.github.io/moda-beyond/moda-beyond.webp">
  <h1 align="center">Oliver Lister's Portfolio & Blog </h1>
</a>

<p align="center">
My Next.js, Supabase and MDX powered portfolio and blog.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#dependencies"><strong>Dependencies</strong></a> ·
  <a href="#resources"><strong>Resources</strong></a> ·
  <a href="#to-dos"><strong>To-dos</strong></a>
</p>
<br/>

## Table of Contents

1. <a href=#setup>Setup</a>
2. <a href=#technologies-used>Technologies Used</a>
3. <a href=#features>Features</a>
4. <a href=#future-to-dos>Future To-dos</a>
5. <a href=#acknowledgements>Acknowledgements</a>

## Setup

_<a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">Node
package manager (npm) and node.js</a> are required for setup._

### Run Frontend Locally using the Render-hosted Backend

Unfortunately you <b>cannot</b> run the backend locally at full functionality
without the keys and secrets in my backend's .env file which is ignored by git.

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

This will connect your frontend running on your localhost server with the
backend hosted by <a href="https://render.com/">render</a>.

_Note: The frontend is currently pointed to a backend hosted by
<a href="https://render.com/">render</a> on a free instance. This means it will
spin down with inactivity, which can delay requests by 50 seconds or more.
Please allow a minute for the backend to warmup on start-up before testing any
functionality._

### Admin (Custom CMS)

The same situation presents itself with the admin frontend, again please run it
in production mode via the below commands:

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

### Shop Fetching / Sorting / Searching

Products are stored in the database, and identified by an \_id property which is
intrinsic to any MongoDB document.

    export default interface ProductProps {
        _id: string;
        name: string;
        category: "men" | "women" | "kids" | string;
        brand: string;
        availableSizes: string[];
        availableColors: { label: string; hex: string }[];
        description: string;
        material: string;
        price: number;
        lastPrice?: number;
        images: string[];
        date: Date;
        available: boolean;
    }

On the frontend, when the user accesses the /shop route, a custom
useFetchProducts.ts hook is used to fetch products from the backend API
'/products/fetch'.

useFetchProducts sends information to the backend via a queryString argument.

    // useFetchProducts.tsx
    import { useState } from "react";
    import ProductProps from "../types/ProductProps";

    type FetchProducts = {
    data: ProductProps[];
    totalCount: number;
    isLoading: boolean;
    error: string;
    };

    export const useFetchProducts = () => {
        const [products, setProducts] = useState<FetchProducts>({
            data: [],
            totalCount: 0,
            isLoading: false,
            error: "",
        });

        const fetchProducts = async (queryString: string): Promise<void> => {
            try {
            setProducts({ ...products, isLoading: true });

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_HOST}/products/fetch?${queryString}`,
                {
                method: "GET",
                }
            );
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(`${responseData.error}, ${responseData.errorCode}`);
            }
            setProducts({
                data: responseData.data,
                totalCount: responseData.totalCount,
                isLoading: false,
                error: "",
            });
            } catch (err) {
                if (err instanceof Error) {
                    setProducts({
                    data: [],
                    isLoading: false,
                    totalCount: 0,
                    error: err.message,
                    });
                    console.error("Error fetching products:", err.message);
                }
            }
        };
        return [products, fetchProducts] as const;
    };

The backend API utilises values provided in the req.query object such as:
sortBy, sortOrder, page, pageSize, and search, and creates an aggregiate
pipeline for searching and retrieving an array of products as well as their
totalCount from MongoDB.

The same functionality could have been achieved with .find(), and
.countDocuments() in Mongoose, but this would've requried TWO separate calls to
the MongoDB, whereas the aggregate pipeline uses $facet to pursue both actions
in a single call. This results in a faster turnaround time for the client. For
example, if a 'search' value is provided in the req.query object (i.e. when a
user uses the search bar on the frontend), then the below aggregate pipeline is
used.

    // productRoutes.ts

    pipeline = [
        {
          $search: {
            index: 'SearchProducts',
            text: {
              query: search,
              path: {
                wildcard: '*',
              },
            },
          },
        },
        { $match: query },
        {
          $facet: {
            data: [{ $sort: sort }, { $skip: (page - 1) * pageSize }, { $limit: pageSize }],
            metadata: [{ $count: 'totalCount' }],
          },
        },
    ];
    const [{ data, metadata }] = await Product.aggregate(pipeline);

In the Shop.tsx component, a useEffect is used to handle the side effect of
running the fetchProducts() function from the useFetchProducts.ts custom hook.
As the searchParams object is passed to the dependency array, whenever a search
param changes, the fetchProducts() function is run again with the updated query
string.

### Product Display

The ProductDisplay.tsx component is built to display an individual product's
information to the user, and provides functionality to add that given product to
a user's cart.

The most interesting design choice for this component, was creating a resizeable
ProductPhotos.tsx component which used JS to scale a left column of scrollable
image thumbnails with the current size of the main image display column.
Clicking on these thumbnails moves the
<a href="https://mantine.dev/x/carousel/">Embla Carousel</a> to the matching
slice to display the chosen image.

    // ProductPhotos.tsx

    const [colHeight, setColHeight] = useState<number | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const imageElement = imageRef.current;

        if (imageElement) {
        const height = imageElement.getBoundingClientRect().height;
        setColHeight(height);
        }
    }, [images, width]);

    ...

    <GridCol span={{ base: 0, md: 2 }}>
        <Stack
        className={styles.thumbnails}
        style={{ maxHeight: colHeight + "px" }}
        >
        {images.map((img, index) => (
            <Image
            key={index}
            src={import.meta.env.VITE_BACKEND_HOST + img}
            onClick={() => handleImageClick(index)}
            w={200}
            h={200}
            />
        ))}
        </Stack>
    </GridCol>

### Login & Signup Forms

Forms on Moda-Beyond are created using Mantine's in-built
<a href="https://mantine.dev/form/use-form/">use-form</a> hook (which is very
similar to the <a href="https://react-hook-form.com/">react-hook-form</a>
library). This was a necessary choice as I was using the Mantine component
library.

To avoid bot submissions, a honeypot field is used which is hidden to real users
and disregarded by the server.

For validation, I use a Yup schema which integrates seamlessly into Mantine's
use-form hook through a YupResolver. Here's an example of my signupSchema used
for the Signup form. Regex was used for the password field.

    // Signup.tsx

    const signupSchema = object().shape({
      email: string()
        .email("Please enter a valid email address")
        .required("Email is required"),
      password: string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      firstName: string().required("First name is required"),
      lastName: string().required("Last name is required"),
      dob: string(),
      newsletter: boolean(),
      shoppingPreference: string(),
      honeypot: string(),
    });

Errors from the backend API are handled through a toggled alert at the top of
the form which encourages the user to try again.

### Authentication

Moda-Beyond's authentication system is built around user's recieving both an
<b>accessToken</b> and a <b>refreshToken</b> from the backend on successful log
in.

On the backend, when a user successfully logs in, an accessToken is generated as
a <a href="https://jwt.io/">JWT</a> carrying the userId as the payload, and a
refreshToken is randomly generated through uuid as it does not need to carry any
payload. Both tokens are stored in localStorage API on the frontend.

When a user makes requests that require authentication (e.g. accessing or
updating their information), the accessToken is sent in the Authentication
header of the request object. This accessToken is decoded on the backend through
an authorizeJWT middleware function. authorizeJWT takes the accessToken JWT and
decodes it using the JWT secret to provide the payload - userId. This userId is
then used to compare with the userId of the information the frontend is trying
to access. If both userIds match, then the user is allowed access.

The refreshToken is stored as a Session document on the database which also
stores the userId. Whenever the user hard refreshes the webpage, the
refreshToken from localStorage is sent to the backend to query the database, and
if a matching token exists then the authentication state is persisted. If a
matching token exists, the previous Session document is updated with a new
refreshToken, and the new refreshToken & accessToken are supplied to the user on
the frontend.

    // authRoutes.ts

    router.post('/refreshtoken', async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({ success: false, error: 'Missing refresh token', errorCode: 'MISSING_REFRESH_TOKEN' });
                }

            const session = await Session.findOne({ refreshToken: refreshToken });

            if (!session) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid refresh token: missing session information',
                    errorCode: 'MISSING_SESSION_INFORMATION',
                });
            }

            const userId = session.userId.toString();

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found', errorCode: 'USER_NOT_FOUND' });
            }

            // Generate a new access token
            const newAccessToken = generateAccessToken(userId.toString(), '5m');
            const newRefreshToken = generateRefreshToken();

            // Update session
            session.updatedAt = new Date();
            session.refreshToken = newRefreshToken;
            await session.save();

            return res.status(200).json({ success: true, message: 'Access token successfully refreshed', newAccessToken, newRefreshToken, userId });
        } catch (err: any) {
            return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
        }
    });

### Cart

The cart is built around using a local state controlled by Redux Toolkit, in
cartSlice.ts. This cartState has a few key-value pairs:

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

When a user opens the webpage, a useEffect in the Layout.tsx page (the root
layout page) completes the following set of conditional statements:

1. Checks whether the user is logged in (user.data is not null) and if so, sets
   the cart to the user's cart data stored in the database.
2. If the user is not logged in, but there's cart data stored in the
   localStorage API, it sets the cart data to that.
3. If neither of these checks result to true, it relys on the default cartState
   which is an empty array [] for cart.items.

<!-- end of the list -->

    // Layout.tsx

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

When a user is logged in, and any change is made to their local cart, a reducer
is dispatched via a RDTK Async Thunk to update the user's cart data in the
database.

    // Layout.tsx

    useEffect(() => {
        if (auth.isAuthenticated) {
        dispatch(updateDBCartAsync(cart));
        }
    }, [cart, auth.isAuthenticated, dispatch]);

That way, the data stored on the database is always up to date with what the
user is being shown live, and as the cart state is stored locally, there is no
delay when the user makes changes to their cart.

#### Comprehensive Cart Logic

When designing the RDTK cartSlice reducers, an edge case became visible to me:

What happens when a user has two cart items of the same product, but with
differing size values... i.e. 1x INTL M Red Shorts, and 1x INTL L Red Shorts.
<br><br> If the user decides to change the size on one of the two items to make
them both match (e.g. INTL M becomes INTL L). Without proper logic, this edge
case would result in two cart item entries for what should just be one: <br><br>
i.e. 1x INTL L Red Shorts, and 1x INTL L Red Shorts. <br><br> When ideally, it
should result in: <br><br> i.e. 2x INTL L Red Shorts. <br><br> To implement this
functionality, I had to first search the existing cart to see if an item of the
same properties existed (same productId, color and size). This below function
finds the index of the first item that returns a true in the conditional
statement.

    // cartSlice.ts

    const sameItemIndex = state.items.findIndex((item, index) => {
        if (index === itemToUpdateIndex) return false;
        return (
        item.productId === itemToUpdate.productId &&
        item.size === newSize &&
        item.color === itemToUpdate.color
        );
    });

If the same product with same size & color properties does not exist, simply
amend the selected item to the new size specified in the reducer's arguments.

    // cartSlice.ts

    if (sameItemIndex === -1) {
        state.items = state.items.map((item) => {
            if (item.cartItemId === cartItemId) {
                return { ...item, size: newSize };
            }
            return item;
        });
        return;
    }

If the same product with the same color and size does exist, add to its quantity
and remove the originally selected cart item.

    // cartSlice.ts

    const newCart: CartItemProps[] = [];

    state.items.forEach((item, index) => {
        if (index === sameItemIndex) {
        const updatedQuantity =
            Number(item.quantity) + Number(itemToUpdate.quantity);
        newCart.push({
            ...item,
            quantity: updatedQuantity,
        });
        } else if (item.cartItemId !== cartItemId) {
            newCart.push(item);
        }
    });
    state.items = newCart;

This style of functionality was also used for the AddItemToCart reducer, to
check whether an item of the same color, size and productId existed when adding
an item to the cart.

### Payments through Stripe API

_Note: This functionality was inspired by Fireship's video and code on Stripe's
new
<a href="https://fireship.io/courses/stripe-saas/bonus-embedded-checkout/">Embedded
Checkout API</a>._

When a user clicks on the Checkout button on the CartOverview component, the
user is re-routed to the /cart/checkout page where a new Checkout session is
created in the backend.

The cart.items state from RDTK becomes line_items in the Stripe request, with
the delivery type also becoming a line_item.

    // checkoutRoutes.ts

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: line_items,
      payment_method_types: ['card'],
      mode: 'payment',
      return_url: `${req.headers.origin}/moda-beyond/#/cart/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      shipping_address_collection: {
        allowed_countries: ['AU'],
      },
      customer_email: req.body.customer_email,
    });

From this session object, a client_secret is passed back to the frontend, and
used to create the instance of the Checkout session.

To access information from the session on the return page
(/cart/checkout/return), another API is used to retrieve the Stripe Checkout
session and display information pertaining to that specific order (i.e. ordered
items and shipping information). For the receipt url, another API is used which
retrieves the PaymentIntent object and passes back the receipt_url to the
frontend.

## Future To-dos

- Change authentication sessions to be stored in a httpOnly cookie instead of in
  localStorage with the accessToken.
- If an expired accessToken is provided, try refresh it using the refreshToken
  first before clearing the authentication state.
- Debug Stripe Checkout API not waiting for cart.items to be populated before
  creating an instance on a page refresh.
- Connect Stripe customer system with Moda-Beyond database users, to populate
  information regarding past orders.

## Acknowledgements

This project orginated from a tutorial from
<a href="https://www.youtube.com/@GreatStackDev">GreatStack</a> on YouTube
called: <a href="https://www.youtube.com/watch?v=y99YgaQjgx4">How To Create Full
Stack E-Commerce Website Using React JS, MongoDB, Express & Node JS 2024</a>.
Once reviewing and implementing GreatStack's build, I diverged on my own project
to create a more efficient, detailed and better looking product:

- I decided to build the entire project in
  <a href="https://www.typescriptlang.org/">TypeScript</a>, which I had never
  used prior.
- I used the <a href="https://mantine.dev/">MantineCSS</a> component library for
  the first time, which after doing research I found it paired well with CSS
  modules.
- Instead of using React's
  <a href="https://react.dev/learn/scaling-up-with-reducer-and-context">Context
  API</a>, I learned and used <a href="https://redux-toolkit.js.org/">Redux
  Tookit</a> for global state management. This also involved learning Async
  Thunks.
- In the Frontend, I created more comprehensive account routes for accessing
  user data, and impressive cart and payment functionality.
- In the Backend, I created a more complex authenication process which allowed
  for database sessions and refresh tokens.
- I also found GreatStack, occasionaly strayed from best design and code
  practices and took some shortcuts which would lead to scalabilities issues
  down the line.

For products, I used content, and images from
<a href="https://www.theiconic.com.au/">TheICONIC</a>. TheICONIC also was a key
design inspiration for a lot of the website, e.g. NavBar and ProductDisplay
component. I also took some inspiration from the way
<a href="https://www.catch.com.au/">Catch.com.au</a> designed their Cart. For
banner images, I used <a href="https://unsplash.com/">UnSplash</a>.

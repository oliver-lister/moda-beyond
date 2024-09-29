<a href="https://oliver-lister.github.io/moda-beyond/">
  <img alt="MØDA-BEYOND" src="./frontend/public/moda-beyond.webp">
  <h1 align="center">MØDA-BEYOND</h1>
</a>

<p align="center">
A full-featured e-commerce store built on the MERN stack.
</p>

<p align="center">
  <a href="#setup"><strong>Setup</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#dependencies"><strong>Dependencies</strong></a> ·
  <a href="#resources"><strong>Resources</strong></a> ·
  <a href="#to-dos"><strong>To-dos</strong></a>
</p>
<br/>

<p>
<strong>MODA-BEYOND</strong> offers a seamless shopping experience across men's, women's, and
kids' fashion categories. Users can create accounts with robust authentication
powered by JWT tokens stored in secure HTTP-only cookies, ensuring their
sessions are persistent across hard refreshes. The platform enables customers to
easily browse, search, and filter products with features like intelligent
sorting, customisable filters, and a dynamic cart that adapts for both guest and
logged-in users. Secure payments are processed through the Stripe API, with
automated shipping and order handling, all while maintaining data privacy and
security throughout the checkout process.
</p>

## Setup

_<a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">Node
package manager (npm) and node.js</a> are required for setup._

### Run Frontend Locally using the Render-hosted Backend

Unfortunately you <b>cannot</b> run the backend locally at full functionality
without the keys and secrets in my backend's .env file which is ignored by git.

To avoid problems, I recommend running the frontend in production mode by:

1. Changing directory into frontend folder.
2. Installing dependencies
3. Running the build command
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

## Dependencies

### Frontend:

| Type        | Dependency                                                                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language/s  | HTML, CSS, Typescript                                                                                                                                 |
| Framework/s | React.js                                                                                                                                              |
| Tools       | Vite, Redux Toolkit, Redux Toolkit Query, MantineCSS, Stripe API, Vitest, React Testing Library, MSW, React Router, Date-fns, Yup, Tabler Icons, UUID |

### Admin CMS:

| Type        | Dependency                                        |
| ----------- | ------------------------------------------------- |
| Language/s  | HTML, CSS, Typescript                             |
| Framework/s | React.js                                          |
| Tools       | Vite, MantineCSS, React Router, Yup, Tabler Icons |

### Backend:

| Type        | Dependency                                                                  |
| ----------- | --------------------------------------------------------------------------- |
| Language/s  | Typescript                                                                  |
| Framework/s | Node.js, Express.js                                                         |
| Tool/s      | dotEnv, Mongoose, Multer, JWT, Nodemon, uuid, Cookie Parser, Argon2, Stripe |
| Database    | MongoDB                                                                     |

## Features

### Product Fetching, Sorting, Searching and Filtering

Products are stored in the MongoDB database, and identified by an \_id property
which is intrinsic to any MongoDB document.

```ts
interface Product {
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
```

On the frontend, when the user accesses the /shop route, RTK Query executes the
useGetProductsQuery() hook to fetch products based on the current searchParams
and store them in the cache, enabling efficient data retrieval and reducing
redundant API requests.

Instead of relying on multiple useState calls to manage query data, searchParams
are used to dynamically store and update the state as users modify their filter
options. This approach enables seamless navigation, allowing users to go back
through their filter selections or easily share the exact filtered URL with
others for a consistent browsing experience.

The backend API utilises values provided in the req.query object such as:
sortBy, sortOrder, page, pageSize, and search, and creates an aggregiate
pipeline for searching, filtering and retrieving an array of products as well as
their totalCount from MongoDB.

The same functionality could have been achieved with .find(), and
.countDocuments() in Mongoose, but this would've requried TWO separate calls to
the MongoDB, whereas the aggregate pipeline uses $facet to pursue both actions
in a single call. This results in a faster turnaround time for the client.

```ts
// GET /products API

let pipeline = [];

if (search) {
  pipeline.push({
    $search: {
      index: "SearchProducts",
      text: { query: search, path: { wildcard: "*" } },
    },
  });
}

pipeline.push(
  { $match: filters },
  {
    $facet: {
      data: [
        { $sort: sort },
        ...(parsedPageSize > 0
          ? [
              { $skip: (parsedPage - 1) * parsedPageSize },
              { $limit: parsedPageSize },
            ]
          : []), // Apply pagination only if pageSize > 0
      ],
      metadata: [{ $count: "totalCount" }],
    },
  }
);

// Execute the aggregation pipeline
const [{ data: products, metadata }] = await Product.aggregate(pipeline);
const totalCount = metadata[0]?.totalCount || 0;
```

#### Testing

Product fetching in the MODA-BEYOND e-commerce store was rigorously tested using
the Mock Service Worker (MSW) library. MSW was implemented to simulate HTTP
requests and mock API responses for various product query routes, ensuring the
frontend behaves correctly without needing actual network requests. This testing
approach verified the accuracy of the useGetProductsQuery() hook, caching
behaviour, and the proper handling of search parameters. By mocking different
scenarios, such as successful product retrieval, no results found, or server
errors, it ensured robust and reliable product fetching functionality across the
application.

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

```ts
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
```

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

```ts
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
```

Errors from the backend API are handled through a toggled alert at the top of
the form which encourages the user to try again.

### Authentication

Moda-Beyond's authentication system is built around users recieving secure
HTTP-only cookies called <b>accessToken</b> and a <b>refreshToken</b> from the
backend on successful login.

On the backend, when a user successfully logs in, an accessToken is generated as
a <a href="https://jwt.io/">JWT</a> carrying the userId as the payload, and a
refreshToken is randomly generated through uuid as it does not need to carry any
payload. Both tokens are passed from the backend in the HTTP response object and
stored on the frontend.

When a user makes requests that require authentication (e.g. accessing or
updating their information), the accessToken is sent in the credentials of the
request object. This accessToken is decoded on the backend through a
cookieJWTAuth middleware function. cookieJWTAuth takes the accessToken JWT and
decodes it using the JWT secret to provide the payload - userId.

If the accessToken JWT has expired, an attempt is made to refresh it using the
refreshToken. If successful, a new accessToken and refreshToken are supplied and
the request moves onto the route handler.

```ts
const cookieJWTAuth = async (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const tokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!accessToken || !tokenSecret) {
    return res.status(401).json({
      success: false,
      error: "Access denied, missing token or missing token secret",
      errorCode: "MISSING_TOKEN",
    });
  }

  try {
    // Decode the accessToken without verifying to check expiry
    const decodedToken = jwt.decode(accessToken) as JwtPayload;

    // If accessToken is expired, attempt to refresh it
    if (
      decodedToken &&
      decodedToken.exp &&
      decodedToken.exp * 1000 < Date.now()
    ) {
      console.log("Attempting to refresh accessToken using refreshToken...");

      // Find the auth session with the refreshToken
      // If found, the session is deleted
      const session = await Session.findOneAndDelete({
        refreshToken: refreshToken,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          error: "Invalid refresh token: missing session information",
          errorCode: "MISSING_SESSION_INFORMATION",
        });
      }

      const userId = session.userId.toString();

      // Generate new accessToken & refresh token
      const newAccessToken = generateAccessToken(userId, "5m");
      const newRefreshToken = generateRefreshToken();

      // Create new DB Auth Session
      const newSession = new Session({
        userId: userId,
        refreshToken: newRefreshToken,
      });
      await newSession.save();

      // Set new tokens in cookies
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      // Attach new accessToken payload to req.user
      req.user = jwt.verify(newAccessToken, tokenSecret);

      console.log("accessToken successfully refreshed!");
      return next();
    }
    // If accessToken is valid and not expired, verify it and attach the payload to req.user
    const verifyPayload = jwt.verify(accessToken, tokenSecret);
    req.user = verifyPayload;
    next();
  } catch (err: any) {
    console.log("Session could not be retrieved...");
    // Clear cookies if tokens are invalid or expired
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(403).json({
      success: false,
      error: `Access denied, invalid token: ${err.message}`,
      errorCode: "INVALID_TOKEN",
    });
  }
};
```

In a following middleware function checkUserAccess, this userId is used to
compare with the userId of the information the frontend is trying to access. If
both userIds match, then the user is allowed access, if not - the request is
denied.

```ts
export const checkUserAccess = (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.user ||
    typeof req.user === "string" ||
    req.user.userId !== req.params.userId
  ) {
    return res.status(403).json({
      success: false,
      error: "You do not have permission to access this resource.",
      errorCode: "FORBIDDEN_ACCESS",
    });
  }
  next();
};
```

### Cart

For logged-in users, cart operations are handled server-side, where requests are
authenticated using JWT middleware, sanitised, and processed efficiently. These
requests are triggered by RTK Query mutations.

For anonymous users, cart functionality is managed client-side through a
dedicated guestCartSlice.ts, alongside helper functions from cartUtils.ts, which
handle state manipulation based on the user’s actions.

But how does the application know which cart to use?

To simplify cart operations for both guest and authenticated users, a reusable
hook, useCart.ts, was created. This hook makes an initial request to the backend
cart endpoint. If successful, the authenticated user's cart is fetched and
stored in the cart variable. If the request fails (indicating an anonymous
user), the guest cart is retrieved from the guestCartSlice.ts. The hook exports
several functions to manipulate the cart state, and each function conditionally
checks whether the user is logged in, adjusting the appropriate cart (guest or
authenticated) based on this. This setup ensures seamless and consistent cart
behaviour for all users.

```ts
export const useCart = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?._id;
  const guestCart = useAppSelector((state) => state.guestCart);
  const dispatch = useAppDispatch();

  const {
    cart: serverCart,
    isLoading,
    ...rest
  } = useGetCartQuery(
    { userId },
    {
      selectFromResult: ({ data, ...rest }) => ({
        cart: data && Object.values(data.entities),
        ...rest,
      }),
      skip: !userId,
    }
  );

  // Calculate cart based on whether serverCart or localCart is available
  const cart = serverCart || guestCart;

  // Calculate total quantity of items in the active cart
  const cartTotal = cart.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0
  );

  // For logged-in users, use RTK Query mutations
  const [addItemToServerCart] = useAddCartItemMutation();
  const [updateItemInServerCart] = useUpdateCartItemMutation();
  const [deleteItemFromServerCart] = useDeleteCartItemMutation();
  const [clearServerCart] = useClearCartMutation();

  // For guests (not logged-in users), mutate localCart
  const addItemToCart = async (newItem: ShallowCartItem) => {
    if (userId) {
      // Call RTK Query mutation if the user is logged in
      try {
        await addItemToServerCart({
          userId,
          newItem: { ...newItem, cartItemId: generateId() },
        }).unwrap();
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
      }
    } else {
      // Otherwise, modify the local cart
      dispatch(setLocalCart(addItemToLocalCart(guestCart, newItem)));
    }
  };

  const updateItemInCart = async (updatedItem: CartItem) => {
    if (userId) {
      // Use RTK Query mutation for logged-in users
      try {
        await updateItemInServerCart({
          userId,
          updatedItem,
        }).unwrap();
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
      }
    } else {
      // Otherwise, update the local cart
      dispatch(setLocalCart(updateItemInLocalCart(guestCart, updatedItem)));
    }
  };

  const removeItemFromCart = async (cartItemId: string) => {
    if (userId) {
      // Use RTK Query mutation for logged-in users
      try {
        await deleteItemFromServerCart({ userId, cartItemId }).unwrap();
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
      }
    } else {
      // Otherwise, remove the item from the local cart
      dispatch(setLocalCart(removeItemFromLocalCart(guestCart, cartItemId)));
    }
  };

  const clearCart = async () => {
    if (userId) {
      try {
        await clearServerCart({ userId }).unwrap();
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
      }
    } else {
      dispatch(clearLocalCart());
    }
  };

  return {
    ...rest,
    isLoading,
    cart,
    cartTotal,
    addItemToCart,
    updateItemInCart,
    removeItemFromCart,
    clearCart,
  };
};
```

#### Comprehensive Cart Logic

When designing the functions that manipulate the cart state, an edge case became
visible to me:

What happens when a user has two cart items of the same product, but with
differing size values... i.e. 1x INTL M Red Shorts, and 1x INTL L Red Shorts.
<br><br> If the user decides to change the size on one of the two items to make
them both match (e.g. INTL M becomes INTL L). Without proper logic, this edge
case would result in two cart item entries for what should just be one: <br><br>
i.e. 1x INTL L Red Shorts, and 1x INTL L Red Shorts. <br><br> When ideally, it
should result in: <br><br> i.e. 2x INTL L Red Shorts. <br>

In my updateItem() function, I was iterating over the current cart and replacing
the entire updatedItem object with the corresponding outdated item, ensuring the
cart reflects the latest changes accurately.

```ts
// cartUtils.ts

export const updateItemInLocalCart = (
  cart: CartItem[],
  updatedItem: CartItem
): CartItem[] => {
  const updatedCart = cart.map((item: CartItem) =>
    updatedItem.cartItemId === item.cartItemId ? updatedItem : item
  );

  return updatedCart;
};
```

To handle this edge case, I implemented a helper function called isMatching().
This function returns true if the productId, size, and color properties of two
cartItem objects are strictly equal. In this scenario, I initialise a new array
called consolidatedCart and iterate through the updatedCart array. For each
cartItem, I check whether a matching item already exists in the consolidatedCart
(using isMatching). If a match is found, the quantity is updated; if no match is
found, the current cartItem is pushed to consolidatedCart.

```ts
// cartUtils.ts

export const isMatching = (
  item: CartItem | ShallowCartItem,
  newItem: CartItem | ShallowCartItem
) =>
  String(item.productId) === String(newItem.productId) &&
  item.size === newItem.size &&
  item.color === newItem.color;

export const updateItemInLocalCart = (
  cart: CartItem[],
  updatedItem: CartItem
): CartItem[] => {
  const updatedCart = cart.map((item: CartItem) =>
    updatedItem.cartItemId === item.cartItemId ? updatedItem : item
  );

  const consolidatedCart: CartItem[] = [];

  updatedCart.forEach((item: CartItem) => {
    const existingItemIndex = consolidatedCart.findIndex((i) =>
      isMatching(i, item)
    );

    if (existingItemIndex !== -1) {
      consolidatedCart[existingItemIndex].quantity += Number(item.quantity);
    } else {
      consolidatedCart.push(item);
    }
  });

  return consolidatedCart;
};
```

This style of functionality was also used for the AddItemToCart function, to
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

The cart state from the useCart hook becomes line_items in the Stripe request,
with the delivery type also becoming a line_item.

```ts
// checkoutRoutes.ts

const session = await stripe.checkout.sessions.create({
  ui_mode: "embedded",
  line_items: line_items,
  payment_method_types: ["card"],
  mode: "payment",
  return_url: `${req.headers.origin}/moda-beyond/#/cart/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
  shipping_address_collection: {
    allowed_countries: ["AU"],
  },
  customer_email: req.body.customer_email,
});
```

From this session object, a client_secret is passed back to the frontend, and
used to create the instance of the Checkout session.

To access information from the session on the return page
(/cart/checkout/return), another API is used to retrieve the Stripe Checkout
session and display information pertaining to that specific order (i.e. ordered
items and shipping information). For the receipt url, another API is used which
retrieves the PaymentIntent object and passes back the receipt_url to the
frontend.

## Resources

For products, I used content, and images from
<a href="https://www.theiconic.com.au/">TheICONIC</a>. TheICONIC also was a key
design inspiration for a lot of the website, e.g. NavBar and ProductDisplay
component. I also took some inspiration from the way
<a href="https://www.catch.com.au/">Catch.com.au</a> designed their Cart. For
banner images, I used <a href="https://unsplash.com/">UnSplash</a>.

## To-dos

- Connect Stripe customer system with Moda-Beyond database users, to populate
  information regarding past orders.
- Encrypt HTTP-only cookies before passing to Frontend.

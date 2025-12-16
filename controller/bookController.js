const books = require("../model/bookModel");
const stripe = require('stripe')(process.env.stripeSecretKey)

exports.addBookController = async (req, res) => {
    console.log("Inside add book controller");

    const { title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category } = req.body

    // const uploadImages = req.files

    var uploadImages = []
    req.files.map((item) => uploadImages.push(item.filename))

    const userMail = req.payload

    console.log(title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages, userMail);

    try {
        const existingBook = await books.findOne({ title, userMail })
        if (existingBook) {
            res.status(401).json(`You have a already added the Book`)
        } else {
            const newBook = new books({
                title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages, userMail
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// get home books
exports.getHomeBooksController = async (req, res) => {
    console.log("Inside Home Book Controller");
    try {
        const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homeBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get all-books - user side
exports.getAllBooksController = async (req, res) => {
    console.log("Inside all books controller");
    // console.log(req.query.search);

    const searchKey = req.query.search

    const userMail = req.payload

    const query = {
        title: { $regex: searchKey, $options: "i" },
        userMail: { $ne: userMail }
    }
    try {
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get a book controller
exports.getABookController = async (req, res) => {
    console.log("Get A Book Controller");
    const { id } = req.params
    console.log(id);


    try {
        const book = await books.findById({ _id: id })
        res.status(200).json(book)

    } catch (error) {
        res.status(500).json(error)
    }
}

// get user added books
exports.getUserBooksController = async (req, res) => {
    console.log("Get userBook Controller");
    const userMail = req.payload

    try {
        const userBooks = await books.find({ userMail })
        res.status(200).json(userBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}

// delete a user added book 
exports.deleteUserAddedBookController = async (req, res) => {
    console.log("inside delete book controller");
    const { id } = req.params

    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json("Book Deleted Successfully")

    } catch (error) {
        res.status(500).json(error)

    }

}

// get user brought book
exports.getUserBroughtBookController = async (req, res) => {
    console.log("inside user brought book controller");
    const userMail = req.payload

    try {
        const broughtBooks = await books.find({ boughtBy: userMail })
        res.status(200).json(broughtBooks)

    } catch (error) {
        res.status(500).json(error)

    }
}

// -----------admin----------

// get all books in admin
exports.getAllBooksAdminController = async (req, res) => {
    console.log("inside get all books admin controller");
    try {
        const allBooks = await books.find()
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}

// update book status-approved
exports.updateBookStatusAdminController = async (req, res) => {
    console.log("inside update book status controller");
    const { id } = req.params
    const updateData = { status: "approved" }
    try {
        const approvedBook = await books.findByIdAndUpdate({ _id: id }, updateData, { new: true })
        res.status(200).json(approvedBook)

    } catch (error) {
        res.status(500).json(error)
    }
}

// make payment
exports.makeBookPaymentController = async (req, res) => {
    console.log("Inside make payment controller");

    const { _id, title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages, userMail } = req.body
    const email = req.payload
    console.log(email);


    try {
        const updateBookPayment = await books.findByIdAndUpdate({ _id }, { title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages, status: "sold", boughtBy: email, userMail }, { new: true })
        console.log(updateBookPayment);

        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: title,
                    description: `${author} | ${publisher}`,
                    images: [imageUrl],
                    metadata: {
                        title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, status: "sold", boughtBy: email, userMail
                    }
                },
                unit_amount: Math.round(dprice * 100)
            },
            quantity: 1
        }]

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: 'payment',
            // success_url: 'http://localhost:5173/payment-success',
            // cancel_url: 'http://localhost:5173/payment-error',
             success_url: 'book-store-frontend-kf1jn6672-alnas-projects-8a3bd7c9.vercel.app/payment-success',
            cancel_url: 'book-store-frontend-kf1jn6672-alnas-projects-8a3bd7c9.vercel.app/payment-error',
        });
        console.log(session);
        res.status(200).json({ checkoutSessionUrl: session.url })
        // res.status(200).json("success response received")
    }
    catch (error) {
        res.status(500).json(error)
    }
}

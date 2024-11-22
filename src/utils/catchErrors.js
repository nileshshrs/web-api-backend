const catchErrors = (controller) => async (req, res, next) => {
    try {
        // throw new Error("this is a test error")
        await controller(req, res, next);
    } catch (error) {
        next(error)
    }
}

export default catchErrors
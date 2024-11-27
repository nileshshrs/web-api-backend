import { z } from "zod"
import SessionModel from "../model/session.js"
import appAssert from "../utils/appAssert.js"
import catchErrors from "../utils/catchErrors.js"
import { NOT_FOUND, OK } from "../utils/constants/http.js"

export const getSessionsController = catchErrors(async (req, res) => {
    const sessions = await SessionModel.find(
        { userID: req.userID, }, { _id: 1, createdAt: 1, }, { sort: { createdAt: -1 }, }
    )

    return res.status(OK).json(sessions.map((session) => ({
        ...session.toObject(),
        ...(session.id === req.sessionID && {
            isCurrent: true
        })
    })
    ))

})

export const deleteSessionsController = catchErrors(async (req, res) => {
    const sessionID = z.string().parse(req.params.id);
    const deleted = SessionModel.findOneAndDelete({
        _id: sessionID,
        userID: req.userID
    })

    appAssert(deleted, NOT_FOUND, "session not found");
    return res.status(OK).json({
        message: "session has been deleted."
    })
})
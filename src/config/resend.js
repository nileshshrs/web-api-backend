import { Resend } from "resend";
import { RESEND_API } from "../utils/constants/env.js";

const resend = new Resend(RESEND_API)

export default resend;
import { Request, Response } from "express";

// Static in-memory object to store form submissions
const formSubmissions: Record<number, any>[] = [];
let submissionId = 1;

export const submitForm = (req: Request, res: Response): any => {
  const formData = req.body;

  // Save data in static object
  formSubmissions.push(formData);

  // Prepare response
  res.status(200).json({
    message: "Form submitted successfully",
    data: formData,
    submissionId: submissionId,
  });

  // Increment ID for next submission   
  submissionId++;
};

// Optional: if you want to expose this for checking submissions
export const getSubmissions = (req: Request, res: Response): any => {
  res.status(200).json({
    message: "All form submissions",
    submissions: formSubmissions,
  });
};

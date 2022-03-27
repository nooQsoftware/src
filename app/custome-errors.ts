import { ErrorMessage } from "ng-bootstrap-form-validation";

export const CUSTOM_ERRORS: ErrorMessage[] = [
  {
    error: "required",
    format: requiredFormat,
  },
  {
    error: "email",
    format: emailFormat,
  },
  {
    error: "age",
    format: ageFormat,
  },
];

export function requiredFormat(label: string, error: any): string {
  return `${label} is a required value!`;
}

export function emailFormat(label: string, error: any): string {
  return `${label} doesn't look like a valid email address.`;
}

export function ageFormat(label: string, error: any): string {
  return `Sorry, you must be ${error} to apply for membership`;
}

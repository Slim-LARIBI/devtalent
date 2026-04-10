import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  expertDocuments: f({
    "application/pdf": { maxFileSize: "10MB", maxFileCount: 1 },
    "application/msword": { maxFileSize: "10MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "10MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    return {
      url: file.url,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
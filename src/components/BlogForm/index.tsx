"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Tiptap from "../Tiptap";
import Image from "next/image";
import useBlogStore from "@/store/blog";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("title is required")
    .min(30, "Minimun 30 word are required in title")
    .max(100, "Maximum 100 word are required in title"),
  author: Yup.string().required("title is required"),
  image: Yup.string().required("Blog photo is required"),
  content: Yup.string()
    .required("content is required")
    .min(100, "Minimun 100 word are required in title")
    .test("is-not-empty", "content is required", (value) => {
      const textContent = value
        ? value.replace(/<\/?[^>]+(>|$)/g, "").trim()
        : "";
      return textContent.length > 0;
    }),
});

interface BlogFormData {
  title: string;
  content: string;
  image: string;
  author: string;
}

const BlogForm = () => {
  const { addBlog } = useBlogStore();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, defaultValues },
  } = useForm<BlogFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
      author: "",
    },
  });

  const onSubmit = async (payload: BlogFormData) => {
    try {
      await addBlog(payload);
      reset();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Personal Information
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <div
                      id="FileUpload"
                      className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary sm:py-7.5"
                    >
                      <input
                        type="file"
                        id="image"
                        accept="image/png, image/jpg, image/jpeg"
                        className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                      />
                      <div className="flex flex-col items-center justify-center">
                        {field.value ? (
                          <Image
                            src={URL.createObjectURL(field.value)}
                            alt="Profile Preview"
                            width={300}
                            height={300}
                            className="h-20 w-20 rounded-xl border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark"
                          />
                        ) : (
                          <span className="flex h-20 w-20 items-center justify-center rounded-xl border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark" />
                        )}
                        {!field.value && (
                          <p className="mt-2.5 text-body-sm font-medium">
                            <span className="text-primary">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                        )}
                        <p className="mt-1 text-body-xs">
                          SVG, PNG, JPG or GIF (max, 800 X 800px)
                        </p>
                      </div>
                    </div>
                  )}
                />
                {errors.image && (
                  <p className="my-2 text-sm text-red-500">
                    {errors.image.message}
                  </p>
                )}

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                    htmlFor="title"
                  >
                    Blog Title
                  </label>
                  <input
                    {...register("title")}
                    className={`w-full rounded-[7px] border-[1.5px] border-stroke bg-white px-4.5 py-2.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Type your blog title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                    htmlFor="author"
                  >
                    Author Name
                  </label>
                  <input
                    {...register("author")}
                    className={`w-full rounded-[7px] border-[1.5px] border-stroke bg-white px-4.5 py-2.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    type="text"
                    name="author"
                    id="author"
                    placeholder="Type your blog author"
                  />
                  {errors.author && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.author.message}
                    </p>
                  )}
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                    htmlFor="content"
                  >
                    Blog content
                  </label>

                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <Tiptap
                        key={field.value}
                        content={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.content.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                    type="submit"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogForm;

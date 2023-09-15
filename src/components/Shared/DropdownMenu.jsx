import { useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Controller } from "react-hook-form";

const options = [
  { id: 1, value: "1", name: "نعم" },
  { id: 2, value: "0", name: "لا" },
];

export default function DropdownMenu({ name, control, defaultValue }) {
  // const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <div className=" flex">
      <div className="mx-auto  w-full">
        <Controller
          defaultValue={defaultValue}
          name={name}
          control={control}
          render={({ field }) => (
            <Listbox value={field.value} onChange={field.onChange}>
              {({ open }) => (
                <>
                  <div className="relative">
                    <span className="inline-block w-full rounded-md shadow-sm">
                      <Listbox.Button className="focus:shadow-outline-blue sm:text-sm sm:leading-5 border-gray-300 relative w-fit min-w-[100px] cursor-default rounded-md border bg-offwhite py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none">
                        <span className="block truncate">
                          {field.value == 1 ? "نعم" : "لا"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg
                            className="text-gray-400 h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </Listbox.Button>
                    </span>

                    <Transition
                      show={open}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      className="absolute z-50 mt-1 w-full rounded-md bg-offwhite shadow-lg"
                    >
                      <Listbox.Options
                        static
                        className="shadow-xs sm:text-sm sm:leading-5  max-h-60 overflow-auto rounded-md py-1 text-base leading-6 focus:outline-none "
                      >
                        {options.map((option) => (
                          <Listbox.Option key={option.id} value={option.value}>
                            {({ selected, active }) => (
                              <div
                                className={`${
                                  active
                                    ? "bg-blue-600 text-offwhite"
                                    : "text-gray-900"
                                } relative cursor-default select-none py-2 pl-8 pr-4`}
                              >
                                <span
                                  className={`${
                                    selected ? "font-semibold" : "font-normal"
                                  } block truncate`}
                                >
                                  {option.name}
                                </span>
                                {selected && (
                                  <span
                                    className={`${
                                      active ? "text-offwhite" : "text-blue-600"
                                    } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          )}
        />
      </div>
    </div>
  );
}

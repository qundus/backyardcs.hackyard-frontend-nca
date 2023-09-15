import React from "react";

const DialogInput = ({
    label,
    register,
    registerName,
    watch,
    currentValue,
    maxValue,
}) => {
    return (
        <>
            <div className="mb-6 flex justify-end gap-x-2  text-xl">
                <span className="max-w-[300px] text-end  text-xl font-medium">
                    {label}
                </span>
            </div>

            <div className="ml-auto flex  w-fit flex-row-reverse items-center  border-b-[3px] border-primary pb-1">
                <span className="pl-12 text-xl">:النتيجة الحالية</span>
                <div className="flex items-baseline justify-start gap-1">
                    <div>
                        <input
                            name={registerName}
                            min={0}
                            max={maxValue}
                            defaultValue={currentValue}
                            className="w-[60px] cursor-pointer appearance-none  rounded-lg bg-gray bg-opacity-50 pt-[6px] pb-[2px] text-center align-middle text-xl focus-visible:outline-none"
                            {...register(registerName)}
                        />
                    </div>
                    <span className="text-xl">{"/ " + maxValue}</span>
                </div>
            </div>
        </>
    );
};

export default DialogInput;

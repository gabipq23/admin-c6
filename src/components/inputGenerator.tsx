import { Form, Input } from "antd";
interface InputGeneratorProps {
  title: string;
  formItemName: string | string[];
  formItemValue: string | number;
  placeholder: string;
}
export default function InputGenerator({
  title,
  formItemName,
  formItemValue,
  placeholder,
}: InputGeneratorProps) {
  return (
    <>
      <div className="flex items-center  gap-2 text-[14px] w-full text-neutral-700">
        <div className="flex">
          <p>
            <strong>{title}</strong>
          </p>
        </div>
        <div className="h-8 ">
          <Form.Item
            className="flex text-[16px] font-light text-[#353535] "
            name={formItemName}
          >
            <Input
              size="small"
              maxLength={50}
              value={formItemValue}
              className="p-2 text-[16px] min-w-[200px] font-light text-[#353535]"
              placeholder={placeholder}
            />
          </Form.Item>
        </div>
      </div>
    </>
  );
}

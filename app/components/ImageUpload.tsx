// @ts-nocheck
import { Button, Group, Input, Progress, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Cross1Icon, ImageIcon, UploadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
  label: string;
  path?: string;
  selected_file?: string | null;
  onSelectFile?: (file: string) => void;
  is_details_hidden?: boolean;
  multimedia?: boolean;
}

const ImageUpload = (props: ImageUploadProps) => {
  const [loading, setLoading] = useState(0);
  const { label, is_details_hidden, multimedia, onSelectFile, ...restProps } =
    props;
  const [selectedFile, setSelectedFile] = useState<any>();

  const changeHandler = (files: any) => {
    const file = files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    if (selectedFile) {
      if (props.onSelectFile) {
        props.onSelectFile(selectedFile);
      }
    }
  }, [selectedFile]);

  return (
    <div className="border-2 border-dashed rounded p-5">
      {props.selected_file ? (
        <div>
          <Input.Wrapper>
            <img
              className="w-full h-full mt-2 rounded-md"
              src={`${URL.createObjectURL(props.selected_file)}`}
              alt=""
            />

            <Button
              compact
              className="mt-3 mb-1"
              variant="subtle"
              onClick={() => {
                setLoading(0);
                onSelectFile("");
              }}
            >
              Change Image
            </Button>
          </Input.Wrapper>
        </div>
      ) : (
        <>
          <Input.Wrapper>
            <Dropzone
              className="mt-2"
              onDrop={(files: any) => changeHandler(files)}
              onReject={(files: any) => {
                toast.error("File not supported or too large (max 10MB)");
              }}
              maxSize={20 * 1024 ** 2}
              accept={
                multimedia
                  ? [
                      "image/png",
                      "image/jpeg",
                      "image/sgv+xml",
                      "image/gif",
                      "video/mp4",
                    ]
                  : IMAGE_MIME_TYPE
              }
              {...restProps}
            >
              <Group
                position="center"
                spacing="xl"
                style={{ minHeight: 120, pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <UploadIcon className="w-8 h-8" />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <Cross1Icon className="w-8 h-8" />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <ImageIcon className="w-8 h-8" />
                </Dropzone.Idle>

                {!is_details_hidden ? (
                  <div>
                    <Text size="xl" inline>
                      {label}
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                      Drag images here or click to select files
                    </Text>
                  </div>
                ) : null}
              </Group>
              {loading !== 0 ? (
                <Progress value={loading} striped animate color={"gray"} />
              ) : null}
            </Dropzone>
          </Input.Wrapper>
        </>
      )}
    </div>
  );
};

export default ImageUpload;

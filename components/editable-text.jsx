import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { ButtonGroup, Flex, IconButton, useEditableControls } from "@chakra-ui/react";

const EditableControls = () => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="xs">
      <IconButton size="xs" icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton size="xs" icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton size="xs" icon={<EditIcon />} {...getEditButtonProps()} />
    </Flex> 
  );
};

export default EditableControls;

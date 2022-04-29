import { Box, Tag } from '@chakra-ui/react';
import React from 'react';
const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
  <Box p="1">
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  </Box>
));

export default CustomCard;

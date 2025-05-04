import React from "react";
import { Link } from "react-router-dom";
import { Box, Text, Badge } from "@adminjs/design-system";

const CategoryList = (props) => {
  const { record } = props;
  const subcategories = record.params.subcategories || [];

  if (!subcategories.length) {
    return <Text>Subcategorylar mavjud emas</Text>;
  }

  return (
    <Box>
      {subcategories.map((sub) => (
        <Box key={sub._id} mb="sm">
          <Link to={`/admin/resources/Category/records/${sub._id}/show`}>
            <Text>{sub.name}</Text>
          </Link>
          <Badge size="sm" variant={sub.isActive ? "success" : "danger"}>
            {sub.isActive ? "Faol" : "Faol emas"}
          </Badge>
        </Box>
      ))}
    </Box>
  );
};

export default CategoryList;

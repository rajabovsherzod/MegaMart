import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Text, Badge, Button, Icon } from '@adminjs/design-system';

const CategoryShow = (props) => {
  const { record, resource } = props;
  const subcategories = record.params.subcategories || [];

  return (
    <Box>
      <Box mb="xl">
        <Button as={Link} to={`/admin/resources/Category/actions/new`} variant="primary">
          <Icon icon="Add" />
          Yangi Subcategory Qo'shish
        </Button>
      </Box>

      {!subcategories.length ? (
        <Text>Bu kategoriyada hali subcategorylar mavjud emas</Text>
      ) : (
        <Box>
          <Text weight="bold" mb="lg">Subcategorylar:</Text>
          {subcategories.map((sub) => (
            <Box key={sub._id} mb="lg" p="lg" border="default">
              <Box flex flexDirection="row" alignItems="center">
                <Link to={`/admin/resources/Category/records/${sub._id}/show`}>
                  <Text variant="lg">{sub.name}</Text>
                </Link>
                <Badge ml="default" size="sm" variant={sub.isActive ? 'success' : 'danger'}>
                  {sub.isActive ? 'Faol' : 'Faol emas'}
                </Badge>
              </Box>
              <Text mt="sm" color="grey">{sub.description}</Text>
              <Box mt="lg">
                <Button 
                  as={Link} 
                  to={`/admin/resources/Category/records/${sub._id}/edit`} 
                  variant="text"
                  mr="default"
                >
                  <Icon icon="Edit" />
                  Tahrirlash
                </Button>
                <Button 
                  as={Link} 
                  to={`/admin/resources/Category/records/${sub._id}/show`} 
                  variant="text"
                >
                  <Icon icon="View" />
                  Ko'rish
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CategoryShow; 
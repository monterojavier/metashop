import React, { Component } from "react";
import Button from "./Button";
import Item from "./Item"
import Form from "./Form"
import axios from "axios";
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Flex,
  Container,
  Center,
  Link,
} from "@chakra-ui/react";

const url = "http://localhost:3001";

class Items extends Component {
  state = {
    items: [],
    user: {},
    CategoryId: window.location.pathname.split("/")[2],
  }

  componentDidMount() {
    axios
      .get(`${url}/categories/${window.location.pathname.split("/")[2]}/items`)
      .then((res) => {
        this.setState({ items: res.data });
      });

      axios.get(`${url}/user/${this.props.userEmail}`).then(res => {
        this.setState({user: res.data})
      })
  }

  handleCreate = (event) => {
    event.preventDefault();
    const title = event.target.titleOfItem.value;
    const imageUrl = event.target.imageOfItem.value;
    const description = event.target.descriptionOfItem.value;
    const price = event.target.priceOfItem.value;

    axios
      .post(`${url}/items`, {
        title,
        imageUrl,
        description,
        price,
        CategoryId: this.state.CategoryId
      })
      .then((res) => {
        this.setState({ items: [...this.state.items, res.data] });
      });
  };

  handleChange = (event) => {
    const value = event.target.value
    this.setState({
      ...this.state,
      [event.target.name]: value
    });
  };


  render() {
    return (
      <>
        {this.state.user.isAdmin ? (
          <Box>
            <SimpleGrid p="5" columns={[1, null, 3]} spacing='40px'>
              {this.state.items.map(item =>{
                return (
                  // Need to add link to each item
                  // Delete button should not be viewable
                  // Description should hide when on ItemsPage
                  <Link href={`/items/${item.id}`}>
                    <Item item={item} userEmail={this.props.userEmail} user={this.state.user}/>
                  </Link>
                );
              })}
            </SimpleGrid>
            <Form submission={this.handleCreate} name={"Add Item"} onChange={this.handleChange}/> 
          </Box>     
        ) : (
          <Box>
            <SimpleGrid columns={[1, null, 3]} spacing="40px" margin="10">
              {this.state.items.map((item) => {
                return (
                  <Link href={`/items/${item.id}`}>
                    <Item item={item} userEmail={this.props.userEmail} user={this.state.user}/>
                  </Link>
                );
              })}
            </SimpleGrid>
          </Box>
        )
        }
      </>
    )
  }
}

export default Items;

// Item (too scared to delete at the moment):
{/* <Flex
key={item.id}
bg="#9A8C98"
direction="column"
borderRadius="0.5em"
justify="space-around"
>
<Container>
  <Center>
    <Link href={`/items/${item.id}`}>
      <Image
        flex="2"
        alignSelf="center"
        src={item.image}
        boxSize="15em"
        float="left"
        objectFit="fill"
        borderRadius="0.5em"
        marginBottom="5"
        marginTop="5"
      />
    </Link>
  </Center>
</Container>
<Flex margin="5" justify="space-between" align="center">
  <Flex direction="column">
    <Box>
      <Text color="black" as="em" justify="center">
        {item.title}
      </Text>
    </Box>
    <Text fontSize="20px">{`$${item.price}`}</Text>
  </Flex>
  <Button
    color="#22223b"
    itemId={item.id}
    userEmail={this.props.userEmail}
  />
</Flex>
</Flex> */}

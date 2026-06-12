"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  shortDescription,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Card sx={{ maxWidth: 320, height: "100%", position: "relative" }}>
      <Box sx={{ position: "relative", height: 220 }}>
        <Image
          src={image}
          alt={name}
          fill
          style={{
            objectFit: "cover",
          }}
        />

        <IconButton
          onClick={() => setIsFavorite(!isFavorite)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "white",
          }}
        >
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      <CardContent>
        <Typography variant="h6" component="h2">
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {shortDescription}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          {formattedPrice}
        </Typography>

        <Button
          component={Link}
          href={`/products/${id}`}
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Ver detalle
        </Button>
      </CardContent>
    </Card>
  );
}
// export const findBestPrice = product => {
//     if (!product || !product.price || product.price.length === 0) {
//       return null;
//     }
  
//     const prices = product.price.map(p => ({
//       _idSupplier: p._idSupplier._id,
//       price: parseFloat(p.price)
//     }));
//     return prices.reduce((min, p) => p.price < min.price ? p : min, prices[0]);
//   };
export const findBestPrice = product => {
  if (!product || !product.price || product.price.length === 0) {
    return null;
  }

  const activePrices = product.price
    .filter(p => p._idSupplier.active)
    .map(p => ({
      _idSupplier: p._idSupplier._id,
      price: parseFloat(p.price)
    }));

  if (activePrices.length === 0) {
    return null;
  }

  return activePrices.reduce((min, p) => p.price < min.price ? p : min, activePrices[0]);
};
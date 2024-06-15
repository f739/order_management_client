export const findBestPrice = product => {
    if (!product || !product.price || product.price.length === 0) {
      return null;
    }
  
    const prices = product.price.map(p => ({
      _idSupplier: p._idSupplier,
      price: parseFloat(p.price)
    }));
  
    return prices.reduce((min, p) => p.price < min.price ? p : min, prices[0]);
  };
  
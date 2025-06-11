
-- Add expiration timestamp to cart items
ALTER TABLE cart_items 
ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '4 hours');

-- Create archived_cart_items table for paid items
CREATE TABLE archived_cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  order_id UUID,
  archived_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  original_cart_item_id UUID
);

-- Add RLS policies for archived_cart_items
ALTER TABLE archived_cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own archived cart items"
  ON archived_cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to clean expired cart items
CREATE OR REPLACE FUNCTION clean_expired_cart_items()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM cart_items 
  WHERE expires_at < now();
END;
$$;

-- Create function to archive cart items when order is paid
CREATE OR REPLACE FUNCTION archive_cart_items_for_order(order_user_id UUID, target_order_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert cart items into archive
  INSERT INTO archived_cart_items (user_id, product_id, quantity, order_id, original_cart_item_id)
  SELECT user_id, product_id, quantity, target_order_id, id
  FROM cart_items
  WHERE user_id = order_user_id;
  
  -- Remove items from cart
  DELETE FROM cart_items 
  WHERE user_id = order_user_id;
END;
$$;

-- Create the products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit TEXT,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the daily_reports table
CREATE TABLE daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name TEXT NOT NULL,
  salesman_name TEXT NOT NULL,
  total_sales NUMERIC(10, 2) NOT NULL,
  total_expenses NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the stock_requests table
CREATE TABLE stock_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_merged BOOLEAN DEFAULT FALSE
);

-- Create the stock_request_items table
CREATE TABLE stock_request_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES stock_requests(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL
);

-- Create the shopping_lists table
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  total_cost NUMERIC(10, 2)
);

-- Create the shopping_list_items table
CREATE TABLE shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_unit TEXT,
  quantity INTEGER NOT NULL,
  is_checked BOOLEAN DEFAULT FALSE
);

-- Create the purchasing_history table
CREATE TABLE purchasing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  total_cost NUMERIC(10, 2) NOT NULL,
  purchase_date TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchasing_history ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON daily_reports FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON stock_requests FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON stock_request_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON shopping_lists FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON shopping_list_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON purchasing_history FOR SELECT USING (true);

-- Create policies to allow all operations for authenticated users (adjust as needed for more granular control)
CREATE POLICY "Allow all operations for anon users" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users" ON daily_reports FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users" ON stock_requests FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users" ON stock_request_items FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users" ON shopping_lists FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users" ON shopping_list_items FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users" ON purchasing_history FOR ALL USING (true);

-- Enable real-time on tables
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE daily_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE stock_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE stock_request_items;
ALTER PUBLICATION supabase_realtime ADD TABLE shopping_lists;
ALTER PUBLICATION supabase_realtime ADD TABLE shopping_list_items;
ALTER PUBLICATION supabase_realtime ADD TABLE purchasing_history;

-- Dummy Data
INSERT INTO products (name, unit, price) VALUES
('Organic Apples', 'kg', 3.50),
('Whole Wheat Bread', 'loaf', 2.75),
('Free-Range Eggs', 'dozen', 4.25),
('Almond Milk', 'liter', 3.00),
('Avocado', 'piece', 1.50);

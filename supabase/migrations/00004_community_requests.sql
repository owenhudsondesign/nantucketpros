-- Community Requests Table
CREATE TABLE community_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homeowner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  preferred_date TIMESTAMPTZ,
  urgency TEXT CHECK (urgency IN ('normal', 'urgent')) DEFAULT 'normal',
  status TEXT CHECK (status IN ('open', 'closed', 'filled')) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Request Responses Table
CREATE TABLE community_request_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES community_requests(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  proposed_price INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_community_requests_homeowner ON community_requests(homeowner_id);
CREATE INDEX idx_community_requests_status ON community_requests(status);
CREATE INDEX idx_community_requests_category ON community_requests(category);
CREATE INDEX idx_community_requests_created ON community_requests(created_at DESC);
CREATE INDEX idx_community_request_responses_request ON community_request_responses(request_id);
CREATE INDEX idx_community_request_responses_vendor ON community_request_responses(vendor_id);

-- RLS Policies
ALTER TABLE community_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_request_responses ENABLE ROW LEVEL SECURITY;

-- Community Requests Policies
CREATE POLICY "Anyone can view open community requests"
  ON community_requests FOR SELECT
  USING (status = 'open');

CREATE POLICY "Homeowners can create requests"
  ON community_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = homeowner_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'homeowner')
  );

CREATE POLICY "Homeowners can update own requests"
  ON community_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = homeowner_id)
  WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can delete own requests"
  ON community_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = homeowner_id);

-- Response Policies
CREATE POLICY "Anyone can view responses"
  ON community_request_responses FOR SELECT
  USING (true);

CREATE POLICY "Vendors can create responses"
  ON community_request_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE id = vendor_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can update own responses"
  ON community_request_responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE id = vendor_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE id = vendor_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can delete own responses"
  ON community_request_responses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE id = vendor_id
      AND user_id = auth.uid()
    )
  );

-- Updated At Trigger
CREATE TRIGGER update_community_requests_updated_at
  BEFORE UPDATE ON community_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

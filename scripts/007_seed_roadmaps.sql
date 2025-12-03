-- Insert official roadmaps with sections and topics

-- DSA Roadmap
INSERT INTO public.roadmaps (id, title, description, category, difficulty, estimated_hours, icon, color, is_official, is_public, total_topics)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Data Structures & Algorithms', 'Master the fundamentals of DSA to ace coding interviews and build efficient software', 'Computer Science', 'intermediate', 120, 'binary', 'emerald', true, true, 45),
('22222222-2222-2222-2222-222222222222', 'Artificial Intelligence & ML', 'Learn AI/ML from basics to advanced neural networks and real-world applications', 'AI/ML', 'advanced', 200, 'brain', 'violet', true, true, 52),
('33333333-3333-3333-3333-333333333333', 'Cybersecurity Fundamentals', 'Protect systems and networks with essential security skills', 'Security', 'intermediate', 100, 'shield', 'red', true, true, 38),
('44444444-4444-4444-4444-444444444444', 'Web Development', 'Full-stack web development from HTML to React and Node.js', 'Web Dev', 'beginner', 150, 'globe', 'blue', true, true, 60),
('55555555-5555-5555-5555-555555555555', 'System Design', 'Design scalable distributed systems like a senior engineer', 'Architecture', 'advanced', 80, 'server', 'amber', true, true, 30)
ON CONFLICT DO NOTHING;

-- DSA Sections
INSERT INTO public.roadmap_sections (id, roadmap_id, title, description, order_index) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Fundamentals', 'Basic concepts and complexity analysis', 1),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Arrays & Strings', 'Essential array and string manipulation techniques', 2),
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Linked Lists', 'Singly, doubly, and circular linked lists', 3),
('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Trees & Graphs', 'Hierarchical and network data structures', 4),
('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Dynamic Programming', 'Optimization through memoization and tabulation', 5)
ON CONFLICT DO NOTHING;

-- DSA Topics
INSERT INTO public.topics (section_id, roadmap_id, title, description, order_index, xp_reward, estimated_minutes) VALUES
-- Fundamentals
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Big O Notation', 'Understanding time and space complexity', 1, 15, 60),
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Recursion Basics', 'Base cases and recursive calls', 2, 20, 90),
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Problem Solving Patterns', 'Common patterns for algorithmic problems', 3, 15, 45),
-- Arrays & Strings
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Two Pointer Technique', 'Efficient array traversal with two pointers', 1, 20, 60),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Sliding Window', 'Optimal subarray/substring problems', 2, 25, 90),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Binary Search', 'Logarithmic time search in sorted arrays', 3, 20, 75),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'String Manipulation', 'Common string algorithms and patterns', 4, 15, 60),
-- Linked Lists
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Singly Linked List', 'Implementation and basic operations', 1, 20, 90),
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Doubly Linked List', 'Bidirectional traversal and operations', 2, 20, 75),
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Fast & Slow Pointers', 'Cycle detection and middle element finding', 3, 25, 60),
-- Trees & Graphs
('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Binary Trees', 'Tree structure and traversals', 1, 25, 120),
('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Binary Search Trees', 'Ordered trees for efficient searching', 2, 25, 90),
('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Graph Representation', 'Adjacency list and matrix', 3, 20, 60),
('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'BFS & DFS', 'Graph traversal algorithms', 4, 30, 120),
-- Dynamic Programming
('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Memoization', 'Top-down dynamic programming', 1, 30, 120),
('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Tabulation', 'Bottom-up dynamic programming', 2, 30, 120),
('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Classic DP Problems', 'Knapsack, LCS, and more', 3, 35, 180)
ON CONFLICT DO NOTHING;

-- AI/ML Sections
INSERT INTO public.roadmap_sections (id, roadmap_id, title, description, order_index) VALUES
('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Mathematics Foundation', 'Essential math for ML', 1),
('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Machine Learning Basics', 'Supervised and unsupervised learning', 2),
('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Deep Learning', 'Neural networks and architectures', 3),
('b4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'NLP & Computer Vision', 'Specialized AI applications', 4)
ON CONFLICT DO NOTHING;

-- AI/ML Topics
INSERT INTO public.topics (section_id, roadmap_id, title, description, order_index, xp_reward, estimated_minutes) VALUES
('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Linear Algebra', 'Vectors, matrices, and operations', 1, 25, 180),
('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Calculus & Optimization', 'Derivatives and gradient descent', 2, 25, 150),
('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Probability & Statistics', 'Distributions and inference', 3, 25, 180),
('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Linear Regression', 'Predicting continuous values', 1, 20, 90),
('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Logistic Regression', 'Binary classification', 2, 20, 90),
('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Decision Trees & Random Forests', 'Tree-based models', 3, 25, 120),
('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'K-Means Clustering', 'Unsupervised learning basics', 4, 20, 75),
('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Neural Network Fundamentals', 'Perceptrons and backpropagation', 1, 30, 150),
('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'CNNs', 'Convolutional neural networks', 2, 35, 180),
('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'RNNs & LSTMs', 'Sequential data processing', 3, 35, 180),
('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Transformers', 'Attention mechanisms', 4, 40, 240),
('b4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Text Processing', 'Tokenization and embeddings', 1, 25, 120),
('b4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Image Classification', 'Building image classifiers', 2, 30, 150),
('b4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'LLMs & Prompt Engineering', 'Working with large language models', 3, 35, 180)
ON CONFLICT DO NOTHING;

-- Web Dev Sections
INSERT INTO public.roadmap_sections (id, roadmap_id, title, description, order_index) VALUES
('c1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'HTML & CSS', 'Building blocks of the web', 1),
('c2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'JavaScript', 'Programming the web', 2),
('c3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'React', 'Modern frontend framework', 3),
('c4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Backend Development', 'Server-side programming', 4)
ON CONFLICT DO NOTHING;

-- Web Dev Topics
INSERT INTO public.topics (section_id, roadmap_id, title, description, order_index, xp_reward, estimated_minutes) VALUES
('c1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'HTML Fundamentals', 'Semantic markup and structure', 1, 15, 60),
('c1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'CSS Basics', 'Styling and selectors', 2, 15, 90),
('c1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Flexbox & Grid', 'Modern layout techniques', 3, 20, 120),
('c1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Responsive Design', 'Mobile-first approach', 4, 20, 90),
('c2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'JS Fundamentals', 'Variables, functions, and scope', 1, 20, 120),
('c2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'DOM Manipulation', 'Interacting with the page', 2, 20, 90),
('c2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Async JavaScript', 'Promises and async/await', 3, 25, 120),
('c2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'ES6+ Features', 'Modern JavaScript syntax', 4, 20, 90),
('c3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'React Basics', 'Components and JSX', 1, 25, 150),
('c3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'State & Props', 'Data flow in React', 2, 25, 120),
('c3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Hooks', 'useState, useEffect, and custom hooks', 3, 30, 180),
('c3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Next.js', 'Full-stack React framework', 4, 35, 240),
('c4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Node.js Basics', 'Server-side JavaScript', 1, 25, 120),
('c4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'REST APIs', 'Building web services', 2, 25, 150),
('c4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Databases', 'SQL and NoSQL fundamentals', 3, 30, 180),
('c4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Authentication', 'User auth and security', 4, 30, 150)
ON CONFLICT DO NOTHING;

-- Cybersecurity Sections
INSERT INTO public.roadmap_sections (id, roadmap_id, title, description, order_index) VALUES
('d1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Security Fundamentals', 'Core security concepts', 1),
('d2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Network Security', 'Protecting network infrastructure', 2),
('d3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Application Security', 'Securing software applications', 3)
ON CONFLICT DO NOTHING;

-- Cybersecurity Topics
INSERT INTO public.topics (section_id, roadmap_id, title, description, order_index, xp_reward, estimated_minutes) VALUES
('d1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'CIA Triad', 'Confidentiality, Integrity, Availability', 1, 15, 45),
('d1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Cryptography Basics', 'Encryption and hashing', 2, 25, 120),
('d1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Risk Assessment', 'Identifying and managing risks', 3, 20, 90),
('d2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Firewalls & IDS', 'Network defense systems', 1, 25, 120),
('d2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'VPNs & Tunneling', 'Secure communications', 2, 20, 90),
('d2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Network Attacks', 'Common attack vectors', 3, 25, 120),
('d3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'OWASP Top 10', 'Web application vulnerabilities', 1, 30, 180),
('d3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Secure Coding', 'Writing secure code', 2, 25, 150),
('d3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Penetration Testing', 'Ethical hacking basics', 3, 35, 240)
ON CONFLICT DO NOTHING;

-- System Design Sections
INSERT INTO public.roadmap_sections (id, roadmap_id, title, description, order_index) VALUES
('e1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Fundamentals', 'Core system design concepts', 1),
('e2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Scalability', 'Building scalable systems', 2),
('e3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Case Studies', 'Real-world system designs', 3)
ON CONFLICT DO NOTHING;

-- System Design Topics
INSERT INTO public.topics (section_id, roadmap_id, title, description, order_index, xp_reward, estimated_minutes) VALUES
('e1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'CAP Theorem', 'Consistency, Availability, Partition tolerance', 1, 25, 90),
('e1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Load Balancing', 'Distributing traffic', 2, 25, 90),
('e1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Caching', 'Improving performance with caches', 3, 25, 120),
('e2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Database Sharding', 'Horizontal data partitioning', 1, 30, 150),
('e2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Message Queues', 'Async communication patterns', 2, 30, 120),
('e2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Microservices', 'Service-oriented architecture', 3, 35, 180),
('e3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Design URL Shortener', 'Building a URL shortening service', 1, 40, 180),
('e3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Design Twitter Feed', 'Social media timeline system', 2, 45, 240),
('e3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Design Chat System', 'Real-time messaging architecture', 3, 45, 240)
ON CONFLICT DO NOTHING;

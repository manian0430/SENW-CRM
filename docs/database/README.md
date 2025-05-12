# Database Documentation

## Database Schema

### Properties Table
```sql
CREATE TABLE properties (
    id VARCHAR(255) PRIMARY KEY,
    apn VARCHAR(255),
    address TEXT,
    city VARCHAR(255),
    state VARCHAR(2),
    zip5 VARCHAR(5),
    price DECIMAL(10,2),
    status VARCHAR(50),
    owner1FirstName VARCHAR(255),
    owner1LastName VARCHAR(255),
    owner1FullName VARCHAR(255),
    owner1EmailAddresses TEXT[],
    owner1PhoneNumbers TEXT[],
    universalLandUse VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
    id VARCHAR(255) PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    type VARCHAR(50),
    status VARCHAR(50),
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    dueDate TIMESTAMP,
    assignedTo VARCHAR(255),
    relatedTo VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignedTo) REFERENCES contacts(id),
    FOREIGN KEY (relatedTo) REFERENCES properties(id)
);
```

## Data Models

### Property Model
```typescript
interface Property {
    id: string;
    apn: string;
    address: string;
    city: string;
    state: string;
    zip5: string;
    price: number;
    status: PropertyStatus;
    owner1FirstName: string;
    owner1LastName: string;
    owner1FullName: string;
    owner1EmailAddresses: string[];
    owner1PhoneNumbers: string[];
    universalLandUse: string;
    createdAt: Date;
    updatedAt: Date;
}

enum PropertyStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    SOLD = 'SOLD',
    ARCHIVED = 'ARCHIVED'
}
```

### Contact Model
```typescript
interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: ContactType;
    status: ContactStatus;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

enum ContactType {
    LEAD = 'LEAD',
    CLIENT = 'CLIENT',
    AGENT = 'AGENT',
    VENDOR = 'VENDOR'
}

enum ContactStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING'
}
```

### Task Model
```typescript
interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date;
    assignedTo: string;
    relatedTo: string;
    createdAt: Date;
    updatedAt: Date;
}

enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}
```

## Relationships

### Property-Contact Relationship
- One-to-Many: A property can have multiple contacts (owners, agents, etc.)
- Many-to-One: A contact can be associated with multiple properties

### Contact-Task Relationship
- One-to-Many: A contact can have multiple tasks
- Many-to-One: A task can be assigned to one contact

### Property-Task Relationship
- One-to-Many: A property can have multiple tasks
- Many-to-One: A task can be related to one property

## Indexes

### Property Indexes
```sql
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_state ON properties(state);
CREATE INDEX idx_properties_zip5 ON properties(zip5);
```

### Contact Indexes
```sql
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_email ON contacts(email);
```

### Task Indexes
```sql
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_dueDate ON tasks(dueDate);
CREATE INDEX idx_tasks_assignedTo ON tasks(assignedTo);
```

## Data Validation

### Property Validation
- APN must be unique
- Address is required
- Price must be positive
- Status must be valid enum value
- Email addresses must be valid format
- Phone numbers must be valid format

### Contact Validation
- Email must be unique
- Phone must be valid format
- Type must be valid enum value
- Status must be valid enum value

### Task Validation
- Title is required
- Status must be valid enum value
- Priority must be valid enum value
- Due date must be in the future
- AssignedTo must reference valid contact
- RelatedTo must reference valid property

## Data Migration

### Version Control
- Database schema changes are version controlled
- Migration scripts are stored in version control
- Each migration is timestamped and documented

### Backup Strategy
- Daily full backups
- Hourly incremental backups
- Point-in-time recovery capability
- Backup verification process

## Performance Optimization

### Query Optimization
- Use appropriate indexes
- Optimize JOIN operations
- Implement query caching
- Monitor query performance

### Data Maintenance
- Regular index maintenance
- Statistics updates
- Data archiving
- Cleanup of obsolete data 
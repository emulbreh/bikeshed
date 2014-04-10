from pldm.documents import Document
from pldm.attributes import Attribute, Identifier, DatetimeAttribute, TicketRef


class Project(Document):
    type_name = 'Project'

    name = Attribute('Name', aliases=('Summary', 'Title'), hidden=True)
    
    def get_title(self):
        return self.name

    def get_label(self):
        return self.name


class Ticket(Document):
    type_name = 'Ticket'

    title = Attribute('Summary', aliases=('Subject', 'Title'), hidden=True)
    project = TicketRef('Project')
    parent = TicketRef('Parent')
    number = Attribute('Number', readonly=True, hidden=True)
    reporter = Attribute('Reporter')
    assigned_to = Attribute('Assigned-To')
    due = DatetimeAttribute('Due')
    reported_at = DatetimeAttribute('Reported-At')
    remaining_time = Attribute('Remaining-Time')
    time_spent = Attribute('Time-Spent')
    tags = Attribute('Tags'),
    see_also = Attribute('See-Also'),
    milestone = TicketRef('Milestone'),
    epic = TicketRef('Epic'),
    estimate = Attribute('Estimate'),
    status = Attribute('Status', choices=[
        'Open', 'Reopened', 'Blocked', 'InProgress',
        'Fixed', 'Wontfix', 'Invalid'
    ])
    
    def get_title(self):
        try:
            return self.title
        except KeyError:
            return self.summary
        
    def get_parent(self):
        return self.parent or self.project

    def is_open(self):
        return self.status not in ('Fixed', 'Wontfix', 'Invalid')

    def get_number(self):
        return self.number


class Story(Ticket):
    type_name = 'Story'


class Bug(Ticket):
    type_name = 'Bug'


class Feature(Ticket):
    type_name = 'Feature'


class User(Document):
    type_name = 'User'
    name = Identifier('Name')

    def get_label(self):
        return '@%s' % self.name

    def get_title(self):
        return self.name


class Iteration(Document):
    project = TicketRef('Project')
    
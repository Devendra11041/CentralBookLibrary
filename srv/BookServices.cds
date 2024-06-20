using Book.Library as db from '../db/data-model';

@path: '/CentralLibrary'

service EmployeeService {
    @restrict: [
        {
            grant: '*',
            to   : 'Admin'
        },
        {
            grant: 'Create',
            to   : 'User'
        }
    ]
    entity Book        as projection on db.Book;

    entity User        as projection on db.User;
    entity ActiveLoans as projection on db.ActiveLoans;
    entity IssueBook   as projection on db.IssueBook;
    entity History     as projection on db.History;
}

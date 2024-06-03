using Book.Library as db from '../db/data-model';
@path: '/CentralLibrary'

service EmployeeService {
    entity Book  as projection on db.Book;
    entity User  as projection on db.User;
    entity ActiveLoans as projection on db.ActiveLoans;
    entity IssueBook as projection on db.IssueBook;
}
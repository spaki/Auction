using Auction.Domain.Exceptions;
using Auction.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Auction.Domain.Managers
{
    public class UserManager 
    {
        private static List<User> users = new List<User>();

        public static void Add(User entity)
        {
            if (entity == null || string.IsNullOrWhiteSpace(entity.Name))
                throw new DomainException("Invalid name."); ;

            var original = GetByName(entity.Name);

            if (original != null)
            {
                entity = original;
                return;
            }

            entity.Id = Guid.NewGuid();
            users.Add(entity);
        }

        public static User GetByName(string name) => users.FirstOrDefault(e => e.Name.Equals(name, StringComparison.InvariantCultureIgnoreCase));
    }
}

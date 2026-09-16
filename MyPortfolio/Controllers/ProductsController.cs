using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ProductsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet]
        public IActionResult GetAll(
            [FromQuery] string? category = null,
            [FromQuery] string? type = null,
            [FromQuery] string? brand = null,
            [FromQuery] string? sort = null,
            [FromQuery] int page = 1,
            [FromQuery] int perPage = 12)
        {
            var path = Path.Combine(_env.WebRootPath, "data", "products.json");
            if (!System.IO.File.Exists(path))
                return NotFound(new { error = "products.json не найден" });

            var json = System.IO.File.ReadAllText(path);
            var data = JsonSerializer.Deserialize<ProductsData>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            var list = data?.Products ?? new List<Product>();

            // Фильтры
            if (!string.IsNullOrEmpty(category) && category != "all")
                list = list.Where(p => p.Category == category).ToList();

            if (!string.IsNullOrEmpty(type) && type != "all")
                list = list.Where(p => p.Type == type).ToList();

            if (!string.IsNullOrEmpty(brand) && brand != "all")
                list = list.Where(p => p.Brand == brand).ToList();

            // Сортировка
            list = sort switch
            {
                "price-asc" => list.OrderBy(p => p.Price).ToList(),
                "price-desc" => list.OrderByDescending(p => p.Price).ToList(),
                "rating" => list.OrderByDescending(p => p.Rating).ToList(),
                "popular" => list.OrderByDescending(p => p.Orders).ToList(),
                _ => list
            };

            // Пагинация
            var total = list.Count;
            var items = list.Skip((page - 1) * perPage).Take(perPage).ToList();

            return Ok(new
            {
                total,
                page,
                perPage,
                totalPages = (int)Math.Ceiling((double)total / perPage),
                items
            });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var path = Path.Combine(_env.WebRootPath, "data", "products.json");
            var json = System.IO.File.ReadAllText(path);
            var data = JsonSerializer.Deserialize<ProductsData>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            var product = data?.Products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();

            return Ok(product);
        }
    }

    public class ProductsData
    {
        public List<Product> Products { get; set; } = new();
    }

    public class Product
    {
        public int Id { get; set; }
        public string Brand { get; set; } = "";
        public string Name { get; set; } = "";
        public int Price { get; set; }
        public int? OldPrice { get; set; }
        public string Category { get; set; } = "";
        public string Type { get; set; } = "";
        public double Rating { get; set; }
        public int Reviews { get; set; }
        public int Orders { get; set; }
        public string Color { get; set; } = "";
    }
}
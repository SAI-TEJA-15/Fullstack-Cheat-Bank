package com.cheatbank.backend.config;

import com.cheatbank.backend.dto.CheatSheetDtos.CommandDto;
import com.cheatbank.backend.dto.CheatSheetDtos.SectionDto;
import com.cheatbank.backend.model.CheatSheet;
import com.cheatbank.backend.model.CheatSheetStatus;
import com.cheatbank.backend.model.User;
import com.cheatbank.backend.model.UserRole;
import com.cheatbank.backend.repository.CheatSheetRepository;
import com.cheatbank.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner seedDefaults(
            UserRepository userRepository,
            CheatSheetRepository cheatSheetRepository,
            PasswordEncoder passwordEncoder,
            ObjectMapper objectMapper
    ) {
        return args -> {
            try {
                User admin = userRepository.findByEmail("admin@cheatbank.com").orElseGet(() -> {
                    User user = new User();
                    user.setUsernameValue("Admin");
                    user.setEmail("admin@cheatbank.com");
                    user.setPasswordHash(passwordEncoder.encode("admin123"));
                    user.setRole(UserRole.ADMIN);
                    return userRepository.save(user);
                });

                seedAll(cheatSheetRepository, objectMapper, admin);
            } catch (Exception exception) {
                logger.warn("Skipping default data seed because the database is not fully ready yet: {}", exception.getMessage());
            }
        };
    }

    private void seedAll(CheatSheetRepository repo, ObjectMapper mapper, User admin) throws Exception {
        // 1. Git Commands
        save(repo, mapper, admin, "Git Commands",
                "A comprehensive reference for Git version control — from basic commits to advanced rebasing and stashing.",
                "Development",
                List.of("git", "version-control", "cli", "devtools"),
                List.of(
                        new SectionDto("Setup & Config", List.of(
                                new CommandDto("git config --global user.name \"Name\"", "Set your global username"),
                                new CommandDto("git config --global user.email \"email@example.com\"", "Set your global email"),
                                new CommandDto("git config --list", "List all Git configuration"),
                                new CommandDto("git init", "Initialize a new local repository"),
                                new CommandDto("git clone <url>", "Clone a remote repository locally")
                        )),
                        new SectionDto("Staging & Committing", List.of(
                                new CommandDto("git status", "Show the current working tree status"),
                                new CommandDto("git add .", "Stage all changes in the current directory"),
                                new CommandDto("git add <file>", "Stage a specific file"),
                                new CommandDto("git commit -m \"message\"", "Commit staged changes with a message"),
                                new CommandDto("git commit --amend", "Modify the most recent commit"),
                                new CommandDto("git diff", "Show unstaged changes"),
                                new CommandDto("git diff --staged", "Show changes staged for the next commit")
                        )),
                        new SectionDto("Branching", List.of(
                                new CommandDto("git branch", "List all local branches"),
                                new CommandDto("git branch <name>", "Create a new branch"),
                                new CommandDto("git checkout <branch>", "Switch to a branch"),
                                new CommandDto("git checkout -b <branch>", "Create and switch to a new branch"),
                                new CommandDto("git switch <branch>", "Switch branches (modern syntax)"),
                                new CommandDto("git merge <branch>", "Merge a branch into the current one"),
                                new CommandDto("git branch -d <branch>", "Delete a branch"),
                                new CommandDto("git rebase <branch>", "Rebase current branch onto another")
                        )),
                        new SectionDto("Remote Operations", List.of(
                                new CommandDto("git remote -v", "Show remote connections"),
                                new CommandDto("git remote add origin <url>", "Add a remote named origin"),
                                new CommandDto("git fetch origin", "Download changes from remote without merging"),
                                new CommandDto("git pull origin main", "Fetch and merge remote main branch"),
                                new CommandDto("git push origin <branch>", "Push local branch to remote"),
                                new CommandDto("git push --force-with-lease", "Force push safely (respects remote state)")
                        )),
                        new SectionDto("Stashing", List.of(
                                new CommandDto("git stash", "Save uncommitted changes temporarily"),
                                new CommandDto("git stash pop", "Apply the last stash and remove it"),
                                new CommandDto("git stash list", "List all stashes"),
                                new CommandDto("git stash apply stash@{1}", "Apply a specific stash"),
                                new CommandDto("git stash drop stash@{0}", "Delete a specific stash")
                        )),
                        new SectionDto("History & Undo", List.of(
                                new CommandDto("git log --oneline", "Show compact commit history"),
                                new CommandDto("git log --graph --all", "Show visual branch graph"),
                                new CommandDto("git show <commit>", "Show details of a specific commit"),
                                new CommandDto("git reset HEAD~1", "Undo last commit, keep changes staged"),
                                new CommandDto("git reset --hard HEAD~1", "Undo last commit and discard changes"),
                                new CommandDto("git revert <commit>", "Create a new commit that undoes a specific one"),
                                new CommandDto("git cherry-pick <commit>", "Apply a single commit from another branch")
                        )),
                        new SectionDto("Tags", List.of(
                                new CommandDto("git tag v1.0.0", "Create a lightweight tag"),
                                new CommandDto("git tag -a v1.0.0 -m \"Release\"", "Create an annotated tag"),
                                new CommandDto("git push origin v1.0.0", "Push a tag to remote"),
                                new CommandDto("git tag -d v1.0.0", "Delete a local tag")
                        ))
                ),
                200, 85
        );

        // 2. Docker Commands
        save(repo, mapper, admin, "Docker Commands",
                "Master Docker containerization — from building images to managing multi-container applications with Compose.",
                "DevOps",
                List.of("docker", "containers", "devops", "deployment", "cli"),
                List.of(
                        new SectionDto("Images", List.of(
                                new CommandDto("docker build -t myapp:1.0 .", "Build an image from Dockerfile"),
                                new CommandDto("docker images", "List all local images"),
                                new CommandDto("docker pull nginx", "Pull an image from Docker Hub"),
                                new CommandDto("docker push myapp:1.0", "Push an image to a registry"),
                                new CommandDto("docker image rm <image_id>", "Remove a local image"),
                                new CommandDto("docker image prune", "Remove all unused images"),
                                new CommandDto("docker tag myapp:1.0 myapp:latest", "Tag an image with a new name")
                        )),
                        new SectionDto("Containers", List.of(
                                new CommandDto("docker run -d -p 8080:80 nginx", "Run container in background, map port 8080 to 80"),
                                new CommandDto("docker run -it ubuntu bash", "Run container interactively with bash shell"),
                                new CommandDto("docker run --rm ubuntu echo hi", "Run container and remove it on exit"),
                                new CommandDto("docker ps", "List running containers"),
                                new CommandDto("docker ps -a", "List all containers (including stopped)"),
                                new CommandDto("docker stop <container_id>", "Stop a running container gracefully"),
                                new CommandDto("docker rm <container_id>", "Remove a stopped container"),
                                new CommandDto("docker exec -it <id> bash", "Open a shell inside a running container"),
                                new CommandDto("docker logs -f <id>", "Follow live logs of a container"),
                                new CommandDto("docker inspect <id>", "Show detailed container metadata")
                        )),
                        new SectionDto("Volumes & Networks", List.of(
                                new CommandDto("docker volume create mydata", "Create a named volume"),
                                new CommandDto("docker run -v mydata:/data nginx", "Mount a volume into a container"),
                                new CommandDto("docker network create mynet", "Create a custom Docker network"),
                                new CommandDto("docker network ls", "List all Docker networks"),
                                new CommandDto("docker run --network mynet nginx", "Run a container on a specific network")
                        )),
                        new SectionDto("Docker Compose", List.of(
                                new CommandDto("docker compose up -d", "Start all services in background"),
                                new CommandDto("docker compose down", "Stop and remove all services"),
                                new CommandDto("docker compose build", "Build or rebuild all service images"),
                                new CommandDto("docker compose logs -f", "Follow logs from all services"),
                                new CommandDto("docker compose exec web bash", "Open a shell in the web service"),
                                new CommandDto("docker compose ps", "Show status of all Compose services")
                        )),
                        new SectionDto("Cleanup", List.of(
                                new CommandDto("docker system prune -a", "Remove all unused containers, images, networks"),
                                new CommandDto("docker container prune", "Remove all stopped containers"),
                                new CommandDto("docker volume prune", "Remove all unused volumes")
                        ))
                ),
                180, 70
        );

        // 3. Python Essentials
        save(repo, mapper, admin, "Python Essentials",
                "Python syntax, data structures, comprehensions, functions, OOP, and common patterns for quick reference.",
                "Programming",
                List.of("python", "programming", "scripting", "beginner", "syntax"),
                List.of(
                        new SectionDto("Basics", List.of(
                                new CommandDto("print(\"Hello, World!\")", "Output text to the console"),
                                new CommandDto("x: int = 10; y: float = 3.14", "Type-annotated variable assignment"),
                                new CommandDto("type(x)", "Get the type of a variable"),
                                new CommandDto("input(\"Enter: \")", "Read user input as a string"),
                                new CommandDto("f\"Hello {name}!\"", "f-string interpolation"),
                                new CommandDto("# This is a comment", "Single-line comment")
                        )),
                        new SectionDto("Data Structures", List.of(
                                new CommandDto("my_list = [1, 2, 3]", "Create a list"),
                                new CommandDto("my_tuple = (1, 2, 3)", "Create an immutable tuple"),
                                new CommandDto("my_dict = {\"key\": \"value\"}", "Create a dictionary"),
                                new CommandDto("my_set = {1, 2, 3}", "Create a set (unique values)"),
                                new CommandDto("my_list[0]", "Access first element (0-indexed)"),
                                new CommandDto("my_list[-1]", "Access last element"),
                                new CommandDto("my_list[1:3]", "Slice elements from index 1 to 2"),
                                new CommandDto("len(my_list)", "Get the number of elements")
                        )),
                        new SectionDto("Control Flow", List.of(
                                new CommandDto("if x > 0:\n    print(\"pos\")\nelif x == 0:\n    print(\"zero\")\nelse:\n    print(\"neg\")", "if / elif / else"),
                                new CommandDto("for i in range(10):\n    print(i)", "For loop with range"),
                                new CommandDto("while x > 0:\n    x -= 1", "While loop"),
                                new CommandDto("break / continue / pass", "Loop control keywords")
                        )),
                        new SectionDto("Functions", List.of(
                                new CommandDto("def greet(name: str) -> str:\n    return f\"Hi {name}\"", "Define a typed function"),
                                new CommandDto("def add(*args): return sum(args)", "*args for variable positional arguments"),
                                new CommandDto("def cfg(**kwargs): print(kwargs)", "**kwargs for keyword arguments"),
                                new CommandDto("square = lambda x: x ** 2", "Lambda (anonymous) function"),
                                new CommandDto("[x*2 for x in range(10)]", "List comprehension"),
                                new CommandDto("{k: v for k, v in d.items()}", "Dictionary comprehension")
                        )),
                        new SectionDto("OOP", List.of(
                                new CommandDto("class Animal:\n    def __init__(self, name):\n        self.name = name", "Define a class with constructor"),
                                new CommandDto("class Dog(Animal):\n    def bark(self):\n        return \"Woof!\"", "Inherit from a parent class"),
                                new CommandDto("@staticmethod\ndef helper(): pass", "Static method (no self)"),
                                new CommandDto("@classmethod\ndef create(cls): return cls()", "Class method (receives cls)"),
                                new CommandDto("@property\ndef full_name(self): return self._name", "Property decorator")
                        )),
                        new SectionDto("Common Built-ins", List.of(
                                new CommandDto("sorted(my_list, reverse=True)", "Sort a list descending"),
                                new CommandDto("map(fn, my_list)", "Apply function to all elements"),
                                new CommandDto("filter(fn, my_list)", "Filter elements where fn returns True"),
                                new CommandDto("zip(list1, list2)", "Pair elements from two lists"),
                                new CommandDto("enumerate(my_list)", "Loop with index and value"),
                                new CommandDto("any(x > 0 for x in lst)", "True if any element satisfies condition"),
                                new CommandDto("all(x > 0 for x in lst)", "True if all elements satisfy condition")
                        ))
                ),
                160, 62
        );

        // 4. Java Essentials
        save(repo, mapper, admin, "Java Essentials",
                "Core Java syntax, OOP principles, Collections, Streams API, and common patterns for enterprise and Android development.",
                "Programming",
                List.of("java", "oop", "jvm", "spring", "programming"),
                List.of(
                        new SectionDto("Basics", List.of(
                                new CommandDto("System.out.println(\"Hello!\");", "Print to console"),
                                new CommandDto("int x = 10; double y = 3.14; String s = \"hi\";", "Primitive and String declarations"),
                                new CommandDto("String msg = String.format(\"Value: %d\", x);", "String formatting"),
                                new CommandDto("var list = new ArrayList<String>();", "Local type inference with var (Java 10+)"),
                                new CommandDto("// Single line  /* Multi\n   line */", "Comments")
                        )),
                        new SectionDto("OOP", List.of(
                                new CommandDto("public class Animal {\n  private String name;\n  public Animal(String name) { this.name = name; }\n}", "Class with constructor"),
                                new CommandDto("public class Dog extends Animal { ... }", "Inheritance (extends)"),
                                new CommandDto("public interface Runnable { void run(); }", "Define an interface"),
                                new CommandDto("public class Cat implements Runnable { ... }", "Implement an interface"),
                                new CommandDto("@Override\npublic void run() { ... }", "Override parent method")
                        )),
                        new SectionDto("Collections", List.of(
                                new CommandDto("List<String> list = new ArrayList<>();", "Create a dynamic list"),
                                new CommandDto("Map<String, Integer> map = new HashMap<>();", "Create a key-value map"),
                                new CommandDto("Set<Integer> set = new HashSet<>();", "Create a unique set"),
                                new CommandDto("Collections.sort(list);", "Sort a list in-place"),
                                new CommandDto("list.stream().filter(...).collect(Collectors.toList());", "Stream filter + collect")
                        )),
                        new SectionDto("Streams & Lambdas", List.of(
                                new CommandDto("list.stream().map(String::toUpperCase).toList();", "Transform all elements"),
                                new CommandDto("list.stream().filter(s -> s.startsWith(\"A\")).toList();", "Filter elements"),
                                new CommandDto("list.stream().reduce(0, Integer::sum);", "Reduce to a single value"),
                                new CommandDto("list.forEach(System.out::println);", "Iterate with method reference"),
                                new CommandDto("Optional<String> opt = Optional.ofNullable(value);", "Null-safe Optional wrapper")
                        )),
                        new SectionDto("Exception Handling", List.of(
                                new CommandDto("try {\n  risky();\n} catch (IOException e) {\n  e.printStackTrace();\n} finally {\n  cleanup();\n}", "try / catch / finally"),
                                new CommandDto("throw new IllegalArgumentException(\"Bad input\");", "Throw an exception"),
                                new CommandDto("public void read() throws IOException { ... }", "Declare checked exception")
                        )),
                        new SectionDto("Modern Java Features", List.of(
                                new CommandDto("record Point(int x, int y) {}", "Immutable record class (Java 16+)"),
                                new CommandDto("sealed class Shape permits Circle, Rect {}", "Sealed class hierarchy (Java 17+)"),
                                new CommandDto("switch(status) {\n  case OPEN -> \"open\";\n  case CLOSED -> \"closed\";\n}", "Switch expression (Java 14+)"),
                                new CommandDto("String text = \"\"\"\n  Hello\n  World\"\"\";", "Multi-line text block (Java 15+)")
                        ))
                ),
                140, 58
        );

        // 5. SQL & Database Queries
        save(repo, mapper, admin, "SQL Queries",
                "Essential SQL commands for querying, modifying, and structuring relational databases like MySQL, PostgreSQL, and SQLite.",
                "Database",
                List.of("sql", "database", "mysql", "postgresql", "queries"),
                List.of(
                        new SectionDto("Querying Data", List.of(
                                new CommandDto("SELECT * FROM users;", "Select all columns from users"),
                                new CommandDto("SELECT name, email FROM users WHERE active = 1;", "Select specific columns with condition"),
                                new CommandDto("SELECT * FROM users ORDER BY name ASC LIMIT 10;", "Order and limit results"),
                                new CommandDto("SELECT DISTINCT category FROM products;", "Select unique values"),
                                new CommandDto("SELECT COUNT(*), AVG(salary) FROM employees;", "Aggregate functions"),
                                new CommandDto("SELECT category, COUNT(*) FROM products GROUP BY category HAVING COUNT(*) > 5;", "Group and filter groups")
                        )),
                        new SectionDto("Joins", List.of(
                                new CommandDto("SELECT u.name, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id;", "INNER JOIN — matching rows only"),
                                new CommandDto("SELECT u.name, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id;", "LEFT JOIN — all users, nulls if no orders"),
                                new CommandDto("SELECT * FROM a CROSS JOIN b;", "CROSS JOIN — every combination"),
                                new CommandDto("SELECT id FROM a UNION SELECT id FROM b;", "Combine results from two queries")
                        )),
                        new SectionDto("Modifying Data", List.of(
                                new CommandDto("INSERT INTO users (name, email) VALUES ('Sai', 'sai@example.com');", "Insert a new row"),
                                new CommandDto("UPDATE users SET email = 'new@example.com' WHERE id = 1;", "Update specific rows"),
                                new CommandDto("DELETE FROM users WHERE id = 1;", "Delete a specific row"),
                                new CommandDto("TRUNCATE TABLE logs;", "Delete all rows fast (non-transactional)")
                        )),
                        new SectionDto("Schema Operations", List.of(
                                new CommandDto("CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, email VARCHAR(200) UNIQUE);", "Create a table"),
                                new CommandDto("ALTER TABLE users ADD COLUMN phone VARCHAR(20);", "Add a column"),
                                new CommandDto("ALTER TABLE users DROP COLUMN phone;", "Remove a column"),
                                new CommandDto("DROP TABLE users;", "Delete an entire table"),
                                new CommandDto("CREATE INDEX idx_email ON users(email);", "Create an index for faster lookups")
                        )),
                        new SectionDto("Subqueries & CTEs", List.of(
                                new CommandDto("SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);", "Subquery in WHERE clause"),
                                new CommandDto("WITH top_users AS (SELECT id FROM users ORDER BY score DESC LIMIT 5)\nSELECT * FROM top_users;", "Common Table Expression (CTE)")
                        ))
                ),
                130, 52
        );

        // 6. Linux / Bash
        save(repo, mapper, admin, "Linux & Bash Commands",
                "Essential Linux terminal commands for navigation, file management, permissions, networking, and process control.",
                "System Admin",
                List.of("linux", "bash", "terminal", "cli", "sysadmin"),
                List.of(
                        new SectionDto("Navigation", List.of(
                                new CommandDto("pwd", "Print current directory"),
                                new CommandDto("ls -la", "List all files with permissions"),
                                new CommandDto("cd /path/to/dir", "Change directory"),
                                new CommandDto("cd ~", "Go to home directory"),
                                new CommandDto("cd -", "Go to previous directory"),
                                new CommandDto("find /var -name \"*.log\"", "Find files by name pattern")
                        )),
                        new SectionDto("File Operations", List.of(
                                new CommandDto("cp file.txt /backup/", "Copy a file"),
                                new CommandDto("mv old.txt new.txt", "Move or rename a file"),
                                new CommandDto("rm -rf /path/", "Delete a directory recursively"),
                                new CommandDto("mkdir -p parent/child", "Create nested directories"),
                                new CommandDto("touch file.txt", "Create an empty file or update timestamp"),
                                new CommandDto("cat file.txt", "Print file content to terminal"),
                                new CommandDto("less file.txt", "Paginate through a file"),
                                new CommandDto("tail -f /var/log/app.log", "Follow live file output")
                        )),
                        new SectionDto("Permissions", List.of(
                                new CommandDto("chmod 755 script.sh", "Set file permissions (rwxr-xr-x)"),
                                new CommandDto("chown user:group file", "Change file owner and group"),
                                new CommandDto("sudo command", "Run command as superuser"),
                                new CommandDto("ls -l file", "View file permission bits")
                        )),
                        new SectionDto("Processes & System", List.of(
                                new CommandDto("ps aux", "List all running processes"),
                                new CommandDto("htop", "Interactive process monitor"),
                                new CommandDto("kill -9 <PID>", "Force kill a process"),
                                new CommandDto("top", "Show live system resource usage"),
                                new CommandDto("df -h", "Show disk usage (human-readable)"),
                                new CommandDto("free -h", "Show memory usage"),
                                new CommandDto("uptime", "Show system uptime and load average")
                        )),
                        new SectionDto("Networking", List.of(
                                new CommandDto("curl -X GET https://api.example.com", "Make a GET HTTP request"),
                                new CommandDto("curl -X POST -H \"Content-Type: application/json\" -d '{\"key\":\"val\"}' <url>", "Make a POST HTTP request"),
                                new CommandDto("wget https://example.com/file.zip", "Download a file"),
                                new CommandDto("netstat -tulnp", "Show open ports and listening services"),
                                new CommandDto("ping google.com", "Check connectivity to a host"),
                                new CommandDto("ssh user@192.168.1.1", "SSH into a remote server"),
                                new CommandDto("scp file.txt user@server:/path/", "Copy file to remote server")
                        ))
                ),
                150, 65
        );

        // 7. JavaScript / TypeScript Essentials
        save(repo, mapper, admin, "JavaScript & TypeScript",
                "Modern JavaScript and TypeScript syntax including ES6+ features, async programming, and type annotations.",
                "Programming",
                List.of("javascript", "typescript", "es6", "frontend", "nodejs"),
                List.of(
                        new SectionDto("Variables & Types", List.of(
                                new CommandDto("const name: string = 'Sai';", "Typed const declaration (TS)"),
                                new CommandDto("let count: number = 0;", "Typed let declaration"),
                                new CommandDto("const isActive: boolean = true;", "Boolean type"),
                                new CommandDto("const data: any = {};", "Any type (avoid if possible)"),
                                new CommandDto("type ID = string | number;", "Union type alias"),
                                new CommandDto("interface User { id: number; name: string; }", "Define an object interface")
                        )),
                        new SectionDto("Functions & Arrow Functions", List.of(
                                new CommandDto("const add = (a: number, b: number): number => a + b;", "Typed arrow function"),
                                new CommandDto("function greet(name?: string): string { return `Hi ${name ?? 'stranger'}`; }", "Optional parameter with nullish coalescing"),
                                new CommandDto("const double = (arr: number[]) => arr.map(x => x * 2);", "Arrow function with array map"),
                                new CommandDto("async function fetchData(url: string): Promise<any> { ... }", "Async function with Promise return type")
                        )),
                        new SectionDto("Arrays & Objects", List.of(
                                new CommandDto("[...arr1, ...arr2]", "Spread operator to merge arrays"),
                                new CommandDto("const { name, age } = user;", "Object destructuring"),
                                new CommandDto("const [first, ...rest] = arr;", "Array destructuring with rest"),
                                new CommandDto("arr.filter(x => x > 0).map(x => x * 2).reduce((a, b) => a + b, 0);", "Chain filter, map, reduce"),
                                new CommandDto("Object.keys(obj) / Object.values(obj) / Object.entries(obj)", "Iterate object keys, values, or entries")
                        )),
                        new SectionDto("Async / Await", List.of(
                                new CommandDto("const data = await fetch('/api/data').then(r => r.json());", "Fetch and parse JSON"),
                                new CommandDto("try { await doAsync(); } catch (e) { console.error(e); }", "Async error handling"),
                                new CommandDto("const [a, b] = await Promise.all([fetchA(), fetchB()]);", "Parallel async calls"),
                                new CommandDto("const result = await Promise.race([fast(), slow()]);", "First promise to resolve wins")
                        )),
                        new SectionDto("Modern JS Features", List.of(
                                new CommandDto("const value = obj?.nested?.property;", "Optional chaining"),
                                new CommandDto("const name = user ?? 'Anonymous';", "Nullish coalescing"),
                                new CommandDto("const clone = structuredClone(original);", "Deep clone an object (ES2022)"),
                                new CommandDto("const uniq = [...new Set(arr)];", "Remove duplicates from array"),
                                new CommandDto("Object.freeze(obj);", "Make an object immutable")
                        ))
                ),
                145, 60
        );

        // 8. Spring Boot Reference
        save(repo, mapper, admin, "Spring Boot Reference",
                "Key annotations, configuration, REST patterns, and JPA essentials for building Spring Boot applications.",
                "Programming",
                List.of("spring", "java", "backend", "rest", "jpa"),
                List.of(
                        new SectionDto("Core Annotations", List.of(
                                new CommandDto("@SpringBootApplication", "Marks the main class; enables auto-config and component scan"),
                                new CommandDto("@RestController", "Marks a class as a REST API controller"),
                                new CommandDto("@Service", "Marks a class as a business logic service"),
                                new CommandDto("@Repository", "Marks a class as a data access layer component"),
                                new CommandDto("@Component", "Generic Spring-managed bean"),
                                new CommandDto("@Configuration", "Marks a class as a source of bean definitions"),
                                new CommandDto("@Bean", "Declares a method that produces a Spring bean")
                        )),
                        new SectionDto("REST Mapping", List.of(
                                new CommandDto("@GetMapping(\"/users\")", "Handle HTTP GET requests"),
                                new CommandDto("@PostMapping(\"/users\")", "Handle HTTP POST requests"),
                                new CommandDto("@PutMapping(\"/users/{id}\")", "Handle HTTP PUT requests"),
                                new CommandDto("@DeleteMapping(\"/users/{id}\")", "Handle HTTP DELETE requests"),
                                new CommandDto("@RequestBody UserDto dto", "Bind JSON request body to an object"),
                                new CommandDto("@PathVariable Long id", "Bind URL path segment to a parameter"),
                                new CommandDto("@RequestParam String filter", "Bind query string parameter")
                        )),
                        new SectionDto("JPA / Hibernate", List.of(
                                new CommandDto("@Entity / @Table(name = \"users\")", "Mark class as a JPA entity"),
                                new CommandDto("@Id / @GeneratedValue(strategy = GenerationType.IDENTITY)", "Primary key and auto-increment"),
                                new CommandDto("@Column(nullable = false, unique = true)", "Column constraint configuration"),
                                new CommandDto("@ManyToOne / @OneToMany(mappedBy = \"user\")", "Define table relationships"),
                                new CommandDto("@CreatedDate / @LastModifiedDate", "Auto-populate timestamps (with @EnableJpaAuditing)")
                        )),
                        new SectionDto("application.properties Keys", List.of(
                                new CommandDto("server.port=8080", "Set the server port"),
                                new CommandDto("spring.datasource.url=jdbc:mysql://...", "Database connection URL"),
                                new CommandDto("spring.jpa.hibernate.ddl-auto=update", "Auto update schema on startup"),
                                new CommandDto("spring.jpa.show-sql=true", "Print SQL queries to console"),
                                new CommandDto("logging.level.com.myapp=DEBUG", "Set log level for a package")
                        ))
                ),
                120, 48
        );

        logger.info("Successfully seeded {} cheat sheets into the database.", 8);
    }

    private void save(CheatSheetRepository repo, ObjectMapper mapper, User admin,
                      String title, String description, String category,
                      List<String> tags, List<SectionDto> content,
                      int views, int downloads) throws Exception {
        CheatSheet sheet = repo.findByTitle(title).orElseGet(() -> {
            CheatSheet s = new CheatSheet();
            s.setTitle(title);
            s.setSubmittedBy(admin);
            s.setApprovedBy(admin);
            s.setStatus(CheatSheetStatus.APPROVED);
            s.setApprovedAt(LocalDateTime.now());
            s.setViews(views);
            s.setDownloads(downloads);
            return s;
        });
        sheet.setDescription(description);
        sheet.setCategory(category);
        sheet.setAuthorName("Admin");
        sheet.setTags(mapper.writeValueAsString(tags));
        sheet.setContent(mapper.writeValueAsString(content));
        sheet.setUpdatedAt(LocalDateTime.now());
        repo.save(sheet);
    }
}
